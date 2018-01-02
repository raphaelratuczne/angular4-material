import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoadingEventsService {

  // evento de emissao de inicio de carregando
  static emitLoading = new EventEmitter<string>();
  // evento de emissao de fim de carregando
  static emitLoaded = new EventEmitter<string>();

  constructor() {  }
}
