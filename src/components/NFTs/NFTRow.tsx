import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
// import { useModContractContext } from '../../contexts/ModContractContext';

interface NFTRowProps {
  item: any;
}

function NFTRow({ item }: NFTRowProps) {
  // const { MoDContract } = useModContractContext();
  const { signer, address } = useAppContext();
  const [unlocking, setUnlocking] = useState(false);
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [unlockedContent, setUnlockedContent] = useState(null);
  const getUnlockableContent = async (item: any) => {
    try {
      setUnlocking(true);
      const nonce = new Date().getTime();
      const message = `${address}-unlock-${item.token.toString()}-${nonce}`;
      const signature = await signer?.signMessage(message);
      // pass tokenid, signature and address to server for verification
      const result = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/unlock`,
        {
          method: 'POST',
          body: JSON.stringify({
            signature,
            message,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const unlockRes = await result.json();
      if (unlockRes) {
        setUnlockStatus(unlockRes.status);
        setUnlockedContent(unlockRes.unlockedLink);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUnlocking(false);
    }
  };

  // const sendNFT = async (item: any, to: string) => {
  //   await MoDContract.transferFrom(address, to, item.token);
  // };

  return (
    <tr>
      <td>
        <img src={item.metaData.image} width="150" alt={item.metaData.name} />
      </td>
      <td>
        {item.loading ? 'Loading...' : ''} {item.token.toString()} -{' '}
        {item.metaData.name}
      </td>
      <td>{item.metaData.description}</td>
      <td>{item.metaData.item_category}</td>
      <td>{item.metaData.item_compatibility}</td>
      <td>
        {!unlocking && !unlockedContent && (
          <button
            className="btn btn-primary"
            onClick={() => {
              getUnlockableContent(item);
            }}
          >
            Unlock
          </button>
        )}
        {unlocking && 'Unlocking...'}
        {unlockedContent && (
          <a href={unlockedContent} target="_blank" rel="noreferrer">
            Click for unlocked content
          </a>
        )}
        {unlockStatus && unlockStatus !== 'unlocked' && (
          <div>Failed to Unlock</div>
        )}
      </td>
    </tr>
  );
}

export default NFTRow;
