/*
  Форматирует сумму, добавляя пробел через каждые 3 символа с конца
*/
export const formatSum = (salary) => {
  const result = typeof salary === 'string' ? salary : salary.toString();

  return result.split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1 ')
    .split('')
    .reverse()
    .join('')
    .trim();
};
