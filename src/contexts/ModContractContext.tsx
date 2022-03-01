import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useAppContext } from '../contexts/AppContext';
import ModABI from '../data/abi/Mod3DItem.json';

interface ContextType {
  MoDContract: any;
}

const ModContractContext = createContext<ContextType>({
  MoDContract: null,
});

interface ModContractWrapperProps {
  children: React.ReactNode;
}

export function ModContractWrapper({ children }: ModContractWrapperProps) {
  const { signer } = useAppContext();
  const [MoDContract, setMoDContract] = useState(
    new Contract(process.env.REACT_APP_MOD_CONTRACT_ADDRESS!, ModABI.abi)
  );
  useEffect(() => {
    if (!!signer && !MoDContract.signer) {
      setMoDContract(MoDContract.connect(signer));
    }
  }, [MoDContract, signer]);

  return (
    <ModContractContext.Provider
      value={{
        MoDContract,
      }}
    >
      {children}
    </ModContractContext.Provider>
  );
}

export function useModContractContext() {
  return useContext(ModContractContext);
}
