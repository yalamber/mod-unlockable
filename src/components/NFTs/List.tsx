import NftRow from './NFTRow';
interface ListNFTsProps {
  items: Array<any>;
}
export default function ListNfts({ items }: ListNFTsProps) {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th scope="col"></th>
            <th scope="col">Name</th>
            <th scope="col">Desciption</th>
            <th scope="col">Category</th>
            <th scope="col">Compatibility</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => (
            <NftRow item={item} key={`row-${index}`} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
