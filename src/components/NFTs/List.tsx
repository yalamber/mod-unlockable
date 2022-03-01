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
    const result = await fetch('/.netlify/functions/unlock', {
      method: 'POST',
      body: JSON.stringify({
        signature,
        message,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(signature, result);
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
              <img src={item.tokenMedata.image} alt={item.tokenMedata.name} />
            </td>
            <td>
              {item.token.toString()} - {item.tokenMedata.name}
            </td>
            <td>{item.tokenMedata.description}</td>
            <td>{item.tokenMedata.item_category}</td>
            <td>{item.tokenMedata.item_compatibility}</td>
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
