interface ListNFTsProps {
  items: Array<any>;
}
export default function ListNfts({ items }: ListNFTsProps) {
  const getUnlockableContent = (item: any) => {
    console.log(item);
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
                Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
