interface ListNFTsProps {
  items: Array<any>;
}
export default function ListNfts({ items }: ListNFTsProps) {
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
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
