import './table-row.css';

function TableRow({sum, year}) {
  const formatYear = (year) => {
    const exception = ['2', '6', '7', '8'];
    const notException = ['12', '16', '17', '18'];
    const yearString = year.toString();

    if (yearString.includes('3') && !yearString.includes('13')) {
      return 'ий';
    }

    const isException = exception.includes(yearString.slice(-1)) && !notException.includes(yearString.slice(-2));

    if (isException) {
      return 'ой';
    }

    return 'ый';
  }

  return (
    <tr className="table-row">
      <td>Чекбокс</td>
      <td>{sum} <span className="table-item-year">в {year}-{formatYear(year)} год</span></td>
    </tr>
  );
}

export default TableRow;
