import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class CancelSimulationLessonEventsService {

  // evento de emissao cancelamento de uma aula agendada
  // apenas para passar os dados entre o dialog e o componete
  static emitCancel = new EventEmitter<number>();

  constructor() {  }
}
