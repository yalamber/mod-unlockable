import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListNFTs from '../components/NFTs/List';
import Layout from '../components/Layout/Main';
import { useAppContext } from '../contexts/AppContext';
import { useModContractContext } from '../contexts/ModContractContext';

export default function Items() {
  let navigate = useNavigate();
  const { isConnected, address, ethersProvider } = useAppContext();
  const { MoDContract } = useModContractContext();
  const [items, setItems] = useState<Array<any>>([]);
  
  useEffect(() => {
    if (!isConnected) {
      return navigate('/');
    }
    
    setItems([]);
  }, [isConnected, navigate, MoDContract]);
  return (
    <Layout
      isConnected={isConnected}
      walletAddress={address}
      disconnect={ethersProvider?.disconnect}
    >
      <div className="container">
        <h1 className="text-center">Your Collections</h1>
        <ListNFTs items={items} />
      </div>
    </Layout>
  );
}
