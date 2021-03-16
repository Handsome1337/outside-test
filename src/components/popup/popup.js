import React, { useState } from 'react';
import ResultTable from '../result-table/result-table';
import { formatSum } from '../../utils/formatSalary';
import './popup.css';

function Popup({onClose}) {
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(false);
  const [isResultTableShow, setIsResultTableShow] = useState(false);
  const [earlyPayments, setEarlyPayments] = useState([]);

  const onSalaryChange = (evt) => {
    let value = evt.target.value;
    if (value) {
      const nonDigitsQuantity = value.replace(/ /g, '').match(/\D/g)?.length;

      value = value.replace(/\D/g, '');
      /*
        Если пользователь нажал Backspace, то в инпуте он удалил символ рубля, хотя хотел
        удалить последнюю цифру введенной зарплаты. Сумма зарплаты в таком случае в инпуте не изменилась.
        nonDigitsQuantity будет равно 0, в таком случае мы обрезаем зарплату на один символ с конца.
      */
      if (value === salary && !nonDigitsQuantity) {
        value = value.slice(0, -1);
      }

      if (value !== salary) {
        setSalary(value);
      }

      if (error) {
        setError(false);
      }
    } else {
      setSalary('');
    }
  };

  const onCalculateClick = () => {
    if (!salary) {
      setError(true);
      return;
    }

    const MAX_DEDUCTION = 260000;
    const annualDeduction = Math.round(salary * 12 * 0.13);
    // Рассчитываем, за сколько лет пользователь может получить максимальный вычет
    const years = Math.ceil(MAX_DEDUCTION / annualDeduction);
    // Рассчитываем сумму вычета за каждый год
    const payments = Array.from({length: years}, (_item, index) => {
      if (index === years - 1) {
        const deduction = MAX_DEDUCTION - annualDeduction * index;
        return deduction;
      }
      return annualDeduction;
    });

    setEarlyPayments(payments);
    setIsResultTableShow(true);
  };

  const onFormSubmit = (evt) => {
    evt.preventDefault();

    if (!salary) {
      setError(true);
      return;
    }

    if (!earlyPayments.length) {
      return;
    }

    /*
      Маппер данных формы. Поля с годами вычетов содержат в своем имени цифры,
      поэтому для таких полей мы берем сумму вычета из состояния earlyPayments.
      Далее создаем объект, в котором описываем значения полей формы, и в конце
      удаляем пробелы и символ рубля из зарплаты. Затем отправляем этот объект на бэк.
    */
    const formData = [...new FormData(evt.target)]
      .map((item) => {
        const isYear = item[0].match(/\d+/);
        if (isYear) {
          return [item[0], earlyPayments[isYear[0] - 1]]
        }

        return item;
      })
      .reduce((acc, cur) => {
        acc[cur[0]] = cur[1];

        return acc;
      }, {});

    formData.salary = formData.salary.replace(/\D/g, '');

    console.log(formData);
    /*
      Здесь добавляем запрос на сервер, отправляющий данные формы formData
     */

    onClose();
  };

  /*
    Форматирует инпут. Если инпут пустой - ничего не меняет,
    Если зарплата введена - добавляет пробел каждые 3 символа с конца и символ рубля
  */
  const formatInput = (salary) => {
    if (!salary) {
      return salary;
    }

    return `${formatSum(salary)} ₽`;
  }

  const resultTable = isResultTableShow ? <ResultTable earlyPayments={earlyPayments} /> : null;

  return (
    <>
      <section className="popup">
        <button className="popup-close" onClick={onClose}>Закрыть окно
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.6151 6.00057L11.6514 1.96311C11.7605 1.85778 11.8475 1.73179 11.9073 1.59248C11.9671 1.45318 11.9986 1.30335 12 1.15174C12.0013 1.00013 11.9724 0.849774 11.915 0.709449C11.8576 0.569124 11.7728 0.441638 11.6656 0.33443C11.5584 0.227222 11.4309 0.142438 11.2905 0.0850268C11.1502 0.0276153 10.9999 -0.00127433 10.8483 4.31116e-05C10.6967 0.00136056 10.5468 0.032859 10.4075 0.0927004C10.2682 0.152542 10.1422 0.239527 10.0369 0.348583L5.99943 4.3849L1.96311 0.348583C1.85778 0.239527 1.73179 0.152542 1.59248 0.0927004C1.45318 0.032859 1.30335 0.00136056 1.15174 4.31116e-05C1.00013 -0.00127433 0.849774 0.0276153 0.709449 0.0850268C0.569124 0.142438 0.441638 0.227222 0.33443 0.33443C0.227222 0.441638 0.142438 0.569124 0.0850268 0.709449C0.0276153 0.849774 -0.00127433 1.00013 4.31116e-05 1.15174C0.00136056 1.30335 0.032859 1.45318 0.0927004 1.59248C0.152542 1.73179 0.239527 1.85778 0.348583 1.96311L4.3849 5.99943L0.348583 10.0369C0.239527 10.1422 0.152542 10.2682 0.0927004 10.4075C0.032859 10.5468 0.00136056 10.6967 4.31116e-05 10.8483C-0.00127433 10.9999 0.0276153 11.1502 0.0850268 11.2905C0.142438 11.4309 0.227222 11.5584 0.33443 11.6656C0.441638 11.7728 0.569124 11.8576 0.709449 11.915C0.849774 11.9724 1.00013 12.0013 1.15174 12C1.30335 11.9986 1.45318 11.9671 1.59248 11.9073C1.73179 11.8475 1.85778 11.7605 1.96311 11.6514L5.99943 7.6151L10.0369 11.6514C10.1422 11.7605 10.2682 11.8475 10.4075 11.9073C10.5468 11.9671 10.6967 11.9986 10.8483 12C10.9999 12.0013 11.1502 11.9724 11.2905 11.915C11.4309 11.8576 11.5584 11.7728 11.6656 11.6656C11.7728 11.5584 11.8576 11.4309 11.915 11.2905C11.9724 11.1502 12.0013 10.9999 12 10.8483C11.9986 10.6967 11.9671 10.5468 11.9073 10.4075C11.8475 10.2682 11.7605 10.1422 11.6514 10.0369L7.6151 5.99943V6.00057Z" fill="#EA0029"/>
          </svg>
        </button>
        <form onSubmit={onFormSubmit}>
          <h2 className="popup-headline">Налоговый вычет</h2>
          <p className="info">Используйте налоговый вычет чтобы погасить ипотеку досрочно.<br className="br-for-computers" /> Размер налогового вычета составляет<br className="br-for-tablets" /> не более 13% от своего официального годового дохода.</p>
          <label className={`input-data-label ${error ? "input-data--error" : ""}`}>
            Ваша зарплата в месяц
            <input
              type="text"
              className="input-data"
              name="salary"
              value={formatInput(salary)}
              onChange={onSalaryChange}
              placeholder={`${error ? "" : "Введите данные"}`}
            />
          </label>
          <button className="calculate-button" type="button" onClick={onCalculateClick}>Рассчитать</button>
          {resultTable}
          <fieldset className="reduce-choice">
            <div className="reduce-choice-wrapper">
              <legend className="reduce-choice-headline">Что уменьшаем?</legend>
              <ul className="reduce-choice-list">
                <li>
                  <input
                    type="radio"
                    className="visually-hidden reduce-choice-radio"
                    id="payment"
                    name="reducer"
                    value="payment"
                    defaultChecked
                  />
                  <label htmlFor="payment" className="reduce-choice-label">Платеж</label>
                </li>
                <li>
                  <input
                    type="radio"
                    className="visually-hidden reduce-choice-radio"
                    id="period"
                    name="reducer"
                    value="period"
                  />
                  <label htmlFor="period" className="reduce-choice-label">Срок</label>
                </li>
              </ul>
            </div>
          </fieldset>
          <button type="submit" className="add-button">Добавить</button>
        </form>
      </section>
      <div className="overlay" onClick={onClose} />
    </>
  );
}

export default Popup;
