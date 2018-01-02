import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { State } from './state.model';
import { CommonService } from '../../common/common.service';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class StateService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'state/';
    // evento
    this.loadingEvent = 'states';
  }

  /**
   * solicita a lista de estados
   * @return {Observable<Estado[]>} objeto com os dados
   */
  public getStates(): Observable<State[]> {

    return this._loadData();

  }

  loadData(): Observable<any> {
    return this.getStates();
  }

  sendData() { return Observable.of(true); }

  editData() { return Observable.of(true); }

  deleteData() { return Observable.of(true); }

}
