import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { ethers, providers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { AppReducer, initialState } from './AppReducer';
import Message, { MsgData } from '../components/ui/Message';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
};

const web3Modal = new Web3Modal({ providerOptions });

interface ContextType {
  state: any;
  ethers: any;
  web3Modal: Web3Modal | null;
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
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageData, setMessageData] = useState<MsgData | null>(null);

  const [state, dispatch] = useReducer(AppReducer, initialState);

  const showMessageHelper = async (
    text: string,
    type: string,
    duration = 2700
  ) => {
    setShowMessage(true);
    setMessageData({ text, type, duration });
    setTimeout(() => {
      setShowMessage(false);
    }, 1000 + duration);
  };

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
  }, [windowEth]);

  // if need to store state in to local storage
  //   useEffect(() => {
  //     if (localStorage.getItem('APP_STATE')) {
  //       try {
  //         const storedState = JSON.parse(
  //           localStorage.getItem('APP_STATE') || '{}'
  //         );
  //         dispatch({
  //           type: 'INIT_STORED',
  //           value: storedState,
  //         });
  //       } catch (e) {
  //         console.log('Unable to parse stored state');
  //       }
  //     }
  //   }, []);
  //   useEffect(() => {
  //     if (state !== initialState) {
  //       localStorage.setItem('APP_STATE', JSON.stringify(state));
  //     }
  //   }, [state]);

  const contextValue = useMemo(() => {
    const onConnectHandler = async () => {
      try {
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const { chainId } = await provider.getNetwork();
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setUserAddress(address);
        setChainId(chainId);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);

        return { provider, address, chainId, signer };
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
        return null;
      }
    };
    const onDisconnectHandler = async () => {
      setUserAddress(null);
      setChainId(null);
      setProvider(null);
      setIsConnected(false);
    };
    const switchNetwork = async () => {
      if (provider) {
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
      }
    };
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
    windowEth,
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
