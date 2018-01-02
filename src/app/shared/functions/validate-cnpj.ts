import { AbstractControl } from '@angular/forms';

/**
 * valida numero de cnpj
 * @param  {AbstractControl} control  dados de formulario
 * @return { {[cnpj:string]:boolean} } validacao de formulario
 */
export function validateCnpj(control: AbstractControl) {
  // console.log('validateCnpj', control.value);

  const cnpj = String(control.value);
  const falso = { cnpj: false };

  return fValidateCnpj(cnpj) ? null : falso;

}

/**
 * funcao para validar cnpj
 * @param  {string}   cnpj
 * @return {boolean}
 */
export const fValidateCnpj = (cnpj:string):boolean => {

  cnpj = cnpj.replace(/[^\d]+/g,'');

  if(cnpj == '') return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == '00000000000000') return false;

  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0,tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += +(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2)
    pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != +digitos.charAt(0))
  return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += +(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2)
    pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != +digitos.charAt(1))
  return false;

  return true;
}
