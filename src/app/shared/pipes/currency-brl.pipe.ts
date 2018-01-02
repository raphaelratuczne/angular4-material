import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyBrl'
})
export class CurrencyBrlPipe implements PipeTransform {
  transform(value: number, locale: string = 'BRL', currency_symbol: boolean = true, number_format: string = '1.2-2'): string {
    if (value) {

      let currencyPipe = new CurrencyPipe(locale);
      let new_value: string;

      new_value = currencyPipe.transform(value, locale, currency_symbol, number_format);
      if (locale = 'BRL')
        new_value = new_value.replace('R$', 'R$ ').replace('.', '|').replace('.', ',').replace('|', '.');


      return new_value
    }
  }
}
