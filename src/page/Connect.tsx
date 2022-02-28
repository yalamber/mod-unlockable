import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Main';
import { useAppContext } from '../contexts/AppContext';

export default function Home() {
  let navigate = useNavigate();
  const { isConnected, ethersProvider } = useAppContext();
  useEffect(() => {
    if (isConnected) {
      navigate('/items');
    }
  }, [isConnected, navigate]);
  const connectWallet = () => {
    ethersProvider?.connect();
  };
  return (
    <Layout>
      <header className="masthead text-center">
        <div className="masthead-content">
          <div className="container px-5">
            <h1 className="masthead-heading mb-0">Mint On Demand</h1>
            <h2 className="masthead-subheading mb-0">Intro Text here </h2>
            <button
              onClick={connectWallet}
              className="btn btn-primary btn-lg rounded-pill mt-5"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </header>
    </Layout>
  );
}
