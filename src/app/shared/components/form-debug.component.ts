import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-debug',
  template: `
  <div *ngIf="form">
    <div style="padding:15px">
      <p>Detalhes do formulario</p>
      <pre>form valido: {{ form.valid }}</pre>
      <pre>dados:<br>{{ form.value | json }}</pre>
    </div>
  </div>
  `,
})
export class FormDebugComponent {

  @Input() form;

  constructor() {  }
}
