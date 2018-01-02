import { AbstractControl, Validators } from '@angular/forms';

/**
 * valida o email (aceita vazio ou null)
 * @param  {AbstractControl} control  dados de formulario
 * @return { {[email:string]:boolean} } validacao de formulario
 */
export function customEmailValidator(control: AbstractControl) {
  if ( !control.value )
    return null;

  return Validators.email(control);
}
