import { useAppContext } from '../../contexts/AppContext';
interface ListNFTsProps {
  items: Array<any>;
}
export default function ListNfts({ items }: ListNFTsProps) {
  const { signer, address } = useAppContext();
  const getUnlockableContent = async (item: any) => {
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
    console.log(signature, unlockRes);
  };
  return (
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
        {items.map((item: any, index: number) => (
          <tr key={`table-item-${index}`}>
            <td>
              <img src={item.metaData.image} alt={item.metaData.name} />
            </td>
            <td>
              {item.loading ? 'Loading...' : ''} {item.token.toString()} -{' '}
              {item.metaData.name}
            </td>
            <td>{item.metaData.description}</td>
            <td>{item.metaData.item_category}</td>
            <td>{item.metaData.item_compatibility}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => {
                  getUnlockableContent(item);
                }}
              >
                Unlock
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
