import './result-table.css';
import TableRow from "../table-row/table-row";

function ResultTable({earlyPayments}) {
  const renderTableRows = (payments) => {
    return payments.map((payment, index) => (
      <TableRow sum={payment} year={(index + 1).toString()} key={index * Math.random()} />
    ))
  };

  return (
    <table className="result-table">
      <caption className="result-table-caption">Итого можете внести в качестве досрочных:</caption>
      <tbody>
        {renderTableRows(earlyPayments)}
      </tbody>
    </table>
  );
}

export default ResultTable;
