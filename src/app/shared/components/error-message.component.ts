import { Component, Input, style, state, animate, transition, trigger } from '@angular/core';

@Component({
  selector: 'error-message',
  template: `
  <div class="alert alert-danger" [@fadeSlideInOut] *ngIf="listErrors?.length > 0">
    <p *ngFor="let error of listErrors">{{ error }}</p>
  </div>
  `,
  animations: [
    trigger('fadeSlideInOut', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate(100, style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate(100, style({ opacity: 0, height: 0 }))
      ])
    ])
  ]
})
export class ErrorMessageComponent {

  @Input() listErrors: Array<string>;

  constructor() {  }
}
