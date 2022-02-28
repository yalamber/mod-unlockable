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
      <div className="container">
        <header className="masthead text-center">Your Collections</header>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Desciption</th>
              <th>Category</th>
              <th>Compatibility</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
