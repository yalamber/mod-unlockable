import NftRow from './NFTRow';
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
          <NftRow item={item} key={`row-${index}`} />
        ))}
      </tbody>
    </table>
  );
}
