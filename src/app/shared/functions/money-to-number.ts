/**
 * converte o valor de moeda para numero
 * @param  {string} val moeda ('R$ 9.999,99')
 * @return {number}     '9999.99'
 */
export const moneyToNumber = (val:string): number => {
  const [num, dec] = val.split(',');
  return +(num.replace(/[^\d|\-]+/g,'') + '.' + dec);
};
