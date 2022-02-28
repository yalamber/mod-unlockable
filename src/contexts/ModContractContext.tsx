import React, { createContext, useContext, useMemo, useState } from 'react';
import { Contract } from 'ethers';
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
  const [ModContract, setModContract] = useState(
    new Contract(process.env.REACT_APP_NFT_CONTRACT_ADDRESS!, ModABI)
  );

  const contextValue = useMemo(() => {
    return {};
  }, []);

  return (
    <ModContractContext.Provider value={contextValue}>
      {children}
    </ModContractContext.Provider>
  );
}

export function useAppContext() {
  return useContext(ModContractContext);
}
