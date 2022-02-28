import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Main';
import { useAppContext } from '../contexts/AppContext';

export default function Items() {
  let navigate = useNavigate();
  const { isConnected, address, ethersProvider } = useAppContext();
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  return (
    <Layout
      isConnected={isConnected}
      walletAddress={address}
      disconnect={ethersProvider?.disconnect}
    >
      <header className="masthead text-center"></header>
    </Layout>
  );
}
