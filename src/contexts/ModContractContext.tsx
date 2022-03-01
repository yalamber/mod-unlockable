import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useAppContext } from '../contexts/AppContext';
import ModABI from '../data/abi/Mod3DItem.json';

interface ContextType {
  contract: any;
}

const ModContractContext = createContext<ContextType>({
  contract: null,
});

interface ModContractWrapperProps {
  children: React.ReactNode;
}

export function ModContractWrapper({ children }: ModContractWrapperProps) {
  const { signer } = useAppContext();

  const [ModContract, setModContract] = useState(
    new Contract(process.env.REACT_APP_NFT_CONTRACT_ADDRESS!, ModABI.abi)
  );
  useEffect(() => {
    if (!!signer) {
      if (!ModContract.signer) {
        setModContract(ModContract.connect(signer));
      }
    }
  }, [ModContract, signer]);

  return (
    <ModContractContext.Provider
      value={{
        contract: ModContract,
      }}
    >
      {children}
    </ModContractContext.Provider>
  );
}

export function useModContractContext() {
  return useContext(ModContractContext);
}
