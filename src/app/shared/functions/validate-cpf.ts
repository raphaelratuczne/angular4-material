import { AbstractControl } from '@angular/forms';

/**
 * valida numero de cpf
 * @param  {AbstractControl} control  dados de formulario
 * @return { {[cpf:string]:boolean} } validacao de formulario
 */
export function validateCpf(control: AbstractControl) {
  // console.log('validateCpf', control.value);
  let cpf = String(control.value);
  let falso = { cpf: false };

  return fValidateCpf(cpf) ? null : falso;
}

/**
 * funcao para validar numero de cpf
 * @param  {string}   cpf
 * @return {boolean}
 */
export const fValidateCpf = (cpf:string):boolean => {
  let soma = 0, resto;

  cpf = cpf.replace(/[^\d]+/g,'');

  // valida de todos os numeros são iguais
  if ( /^(.)\1+$/.test(cpf) )
    return false;

  for (let i=1; i<=9; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if ((resto == 10) || (resto == 11))
    resto = 0;

  if (resto != parseInt(cpf.substring(9, 10)) )
    return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if ((resto == 10) || (resto == 11))
    resto = 0;

  if (resto != parseInt(cpf.substring(10, 11) ) )
    return false;

  return true;
};
