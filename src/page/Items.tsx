import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListNFTs from '../components/NFTs/List';
import Layout from '../components/Layout/Main';
import { useAppContext } from '../contexts/AppContext';
import { useModContractContext } from '../contexts/ModContractContext';

export default function Items() {
  let navigate = useNavigate();
  const { isConnected, address, ethersProvider } = useAppContext();
  const [loading, setLoading] = useState(true);
  const { MoDContract } = useModContractContext();
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    if (!isConnected) {
      return navigate('/');
    }
    (async function () {
      try {
        if (address && MoDContract) {
          const balance = await MoDContract.balanceOf(address);
          const tokens = [];
          for (let i = 0; i < balance; i++) {
            const token = await MoDContract.tokenOfOwnerByIndex(address, i);
            const tokenURI = await MoDContract.tokenURI(token);
            let tokenMedata = await fetch(`/token-jsons/${token}.json`);
            tokenMedata = await tokenMedata.json();
            tokens.push({
              token,
              tokenURI,
              tokenMedata,
            });
          }
          setItems(tokens);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isConnected, navigate, address, MoDContract]);
  return (
    <Layout
      isConnected={isConnected}
      walletAddress={address}
      disconnect={ethersProvider?.disconnect}
    >
      <div className="container">
        <h1 className="text-center">Your Collections</h1>
        {loading && <>Loading...</>}
        {!loading && <ListNFTs items={items} />}
      </div>
    </Layout>
  );
}
