import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfPipe'
})
export class CpfPipe implements PipeTransform {
  transform(value: string|number, args?: any[]): string {
    return String(value).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}
