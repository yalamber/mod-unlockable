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
  const [balance, setBalance] = useState(0);
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
          const nfts: Array<any> = [];
          setBalance(balance);
          setLoading(false);
          for (let i = 0; i < balance; i++) {
            nfts.push({
              tokenIndex: i,
              loading: true,
              token: '',
              metaData: {},
            });
          }
          setItems(nfts);
          // update item
          for (let nft of nfts) {
            const token = await MoDContract.tokenOfOwnerByIndex(
              address,
              nft.tokenIndex
            );
            let metaData = await fetch(`/token-jsons/${token}.json`);
            metaData = await metaData.json();
            nfts[nft.tokenIndex] = {
              tokenIndex: nft.tokenIndex,
              loading: false,
              token,
              metaData,
            };
            setItems([...nfts]);
          }
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
        <h2 className="text-center">
          Your Collections {balance > 0 && <>({balance.toString()})</>}
        </h2>
        {loading && <>Loading...</>}
        {!loading && <ListNFTs items={items} />}
      </div>
    </Layout>
  );
}
