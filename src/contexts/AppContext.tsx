import React, {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { ethers, providers } from 'ethers';
import Web3Modal, { IProviderOptions } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { AppReducer, initialState } from './AppReducer';
import Message, { MsgData } from '../components/ui/Message';

interface ContextType {
  state: any;
  ethers: any;
  web3Modal: Web3Modal | null | undefined;
  ethersProvider?: {
    connect: () => void;
    disconnect: () => void;
  };
  dispatch: any; // see if we can use React.Dispatch<{ type: string; value: unknown }>
  address: string | null;
  chainId: number | null;
  provider: providers.Web3Provider | null;
  signer: providers.JsonRpcSigner | null;
  isConnected: boolean;
  switchNetwork?: () => void;
}

const AppContext = createContext<ContextType>({
  state: initialState,
  ethers: null,
  web3Modal: null,
  dispatch: null,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  isConnected: false,
});

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const windowEth = window.ethereum;
  const [isConnected, setIsConnected] = useState(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageData, setMessageData] = useState<MsgData | null>(null);

  const [state, dispatch] = useReducer(AppReducer, initialState);

  const showMessageHelper = useCallback(
    async (text: string, type: string, duration = 2700) => {
      setShowMessage(true);
      setMessageData({ text, type, duration });
      setTimeout(() => {
        setShowMessage(false);
      }, 1000 + duration);
    },
    []
  );

  const onDisconnectHandler = useCallback(async () => {
    setUserAddress(null);
    setChainId(null);
    setProvider(null);
    setIsConnected(false);
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    dispatch({
      type: 'SET_CONNECTED',
      value: false,
    });
  }, [web3Modal]);

  const switchNetwork = useCallback(async () => {
    try {
      await windowEth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.REACT_APP_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: process.env.REACT_APP_CHAIN_ID,
                chainName: process.env.REACT_APP_NETWORK_NAME,
                rpcUrls: [process.env.REACT_APP_RPC_URL],
              },
            ],
          });
        } catch (addError) {
          showMessageHelper('Switching Network Failed!', 'warning');
          console.log('addError:', addError);
        }
      } else {
        showMessageHelper('Switching Network Failed!', 'warning');
        console.log(switchError);
      }
    }
  }, [windowEth, showMessageHelper]);

  const onConnectHandler = useCallback(async () => {
    try {
      const instance = await web3Modal?.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const { chainId } = await provider.getNetwork();
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setUserAddress(address);
      setChainId(chainId);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
      dispatch({
        type: 'SET_CONNECTED',
        value: true,
      });
      provider.on('accountsChanged', (newAccounts: string[]) => {
        console.log('accounts changed', newAccounts);
        if (Array.isArray(newAccounts) && newAccounts.length) {
          setUserAddress(newAccounts[0]);
        } else if (newAccounts?.length === 0) {
          onDisconnectHandler();
        }
      });
      provider.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId));
      });
      if (chainId !== parseInt(process.env.REACT_APP_CHAIN_ID!)) {
        switchNetwork();
      }
    } catch (error) {
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (!errorMessage) return null;
      errorMessage = errorMessage.toLowerCase();
      if (errorMessage.includes('user rejected')) {
        showMessageHelper('Wallet connection was cancelled!', 'warning');
      } else {
        showMessageHelper(errorMessage, 'warning');
      }
    }
  }, [switchNetwork, onDisconnectHandler, showMessageHelper, web3Modal]);

  useEffect(() => {
    const initWeb3Modal = async () => {
      try {
        if (!web3Modal) {
          const providerOptions: IProviderOptions = {
            metamask: {
              package: null,
            },
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: process.env.REACT_APP_INFURA_ID,
              },
            },
          };
          const newWeb3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
            theme: 'light',
          });
          setWeb3Modal(newWeb3Modal);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (localStorage.getItem('APP_STATE')) {
      try {
        const storedState = JSON.parse(localStorage.getItem('APP_STATE')!);
        dispatch({
          type: 'INIT_STORED',
          value: storedState,
        });
        if (storedState?.isConnected) {
          setIsConnected(storedState.isConnected);
        }
      } catch (e) {
        console.log('Unable to parse stored state', e);
        localStorage.removeItem('APP_STATE');
      }
    }
    initWeb3Modal();
  }, []);

  useEffect(() => {
    if (web3Modal === undefined) return;
    if (typeof window.ethereum !== 'undefined') {
      if (isConnected) {
        onConnectHandler();
      }
    }
  }, [web3Modal, isConnected, onConnectHandler]);

  useEffect(() => {
    // TODO deep compare states
    if (state !== initialState) {
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    // OnLoad: Check if proper network is selected
    if (windowEth) {
      (async () => {
        try {
          await windowEth.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: process.env.REACT_APP_CHAIN_ID }],
          });
        } catch (e) {
          showMessageHelper(
            'Please connect to the Ethereum network',
            'warning'
          );
        }
      })();
    } else {
      showMessageHelper('Please consider installing Metamask.', 'warning');
    }
  }, [windowEth, showMessageHelper]);

  const contextValue = useMemo(() => {
    return {
      state,
      dispatch,
      switchNetwork,
      ethers,
      web3Modal,
      address: userAddress,
      chainId,
      provider,
      signer,
      isConnected,
      ethersProvider: {
        connect: onConnectHandler,
        disconnect: onDisconnectHandler,
      },
    };
  }, [
    state,
    dispatch,
    chainId,
    isConnected,
    userAddress,
    provider,
    signer,
    web3Modal,
    onConnectHandler,
    onDisconnectHandler,
    switchNetwork,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      {showMessage && messageData !== null && <Message data={messageData} />}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
