import React from 'react';
import './table-row.css';
import { formatSum } from '../../utils/formatSalary';

function TableRow({sum, year}) {
  // Форматирует окончание года
  const formatYear = (year) => {
    const exception = ['2', '6', '7', '8'];
    const notException = ['12', '16', '17', '18'];

    if (year.includes('3') && !year.includes('13')) {
      return 'ий';
    }

    // Если год содержит в себе цифры 2, 6, 7, 8 и при этом не содержит 12, 16, 17 и 18
    const isException = exception.includes(year.slice(-1)) && !notException.includes(year.slice(-2));

    if (isException) {
      return 'ой';
    }

    return 'ый';
  }

  return (
    <tr className="table-row">
      <td>
        <input
          type="checkbox"
          className="visually-hidden table-row-checkbox"
          id={`${year}year`}
          name={`${year}year`}
        />
        <label htmlFor={`${year}year`} className="table-row-checkbox-label" />
      </td>
      <td>
        {formatSum(sum)} рублей <span className="table-item-year">в {year}-{formatYear(year)} год</span>
      </td>
    </tr>
  );
}

export default TableRow;
