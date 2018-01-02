import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService, State } from 'app/shared';
import { Department } from './department.model';

@Injectable()
export class DepartmentService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/department';
    // evento
    this.loadingEvent = 'moduleCf-department';
  }

  /**
   * solicita os dados
   * @return {Observable<Department>} objeto com os dados
   */
  public loadData(): Observable<Department> {

    return this._loadData()
      .map( res => {
        let data = new Department(res)
        // converte o numero para string
        data.numberToString('communicationType');
        // passa apenas o id do estado
        data.state = String(data.state['id']);

        return data;
      } );

  }

  /**
   * envia os dados
   * @param  {Department} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Department, states: State[]): Observable<boolean> {

    // console.log(obj);
    let body = new Department(obj);
    // converte string para number
    body.stringToNumber('communicationType');
    // converte o id do estado para o objeto
    body.state = states.find( e => e.id === +body.state );

    return this._sendData(body);

  }

  editData() { return Observable.of(true); }

  deleteData() { return Observable.of(true); }

}
