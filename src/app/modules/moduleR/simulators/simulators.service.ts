import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Simulators } from './simulators.model';

@Injectable()
export class SimulatorsService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/simulator/';
    // evento
    this.loadingEvent = 'moduleR-simulators';
  }

  /**
   * solicita os dados
   * @return {Observable<Simulators>} objeto com os dados
   */
  public loadData(): Observable<Simulators[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new Simulators(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {Simulators} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Simulators): Observable<boolean> {

    obj = new Simulators(obj);
    obj.nullToBoolean('active');

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {Simulators} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Simulators): Observable<boolean> {

    obj = new Simulators(obj);
    obj.nullToBoolean('active');

    return this._editData(obj, null, obj.id);

  }

  /**
   * exclui dados
   * @param  {number}          id id do item
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id);

  }

}
