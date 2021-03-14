import './result-table.css';
import TableRow from "../table-row/table-row";

function ResultTable() {
  const renderTableRows = (data) => {
    return data.map((item, index) => (
      <TableRow sum={item} year={index + 1} key={index * Math.random()} />
    ))
  };

  return (
    <table className="result-table">
      <caption className="result-table-caption">Итого можете внести в качестве досрочных:</caption>
      <tbody>
        {renderTableRows([78000, 78000, 78000, 26000])}
      </tbody>
    </table>
  );
}

export default ResultTable;
