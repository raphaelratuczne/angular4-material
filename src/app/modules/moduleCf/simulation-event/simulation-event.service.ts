import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulationEvent } from './simulation-event.model';

@Injectable()
export class SimulationEventService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url so servico
    this.apiUrl = 'admin/event/';
    // url para categorias
    this.apiUrl = ['categories','admin/event/categories'];
    // evento
    this.loadingEvent = 'moduleCf-simulation-event';
  }

  /**
   * solicita os dados
   * @return {Observable<SimulationEvent>} objeto com os dados
   */
  public loadData(): Observable<SimulationEvent[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new SimulationEvent(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita os dados
   * @return {Observable<Object>} objeto com os dados
   */
  public loadCategories(): Observable<Object> {

    return this._loadData('categories');

  }

  /**
   * envia os dados
   * @param  {SimulationEvent} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: SimulationEvent): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {SimulationEvent} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: SimulationEvent): Observable<boolean> {

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
