import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulationActivity } from './simulation-activity.model';

@Injectable()
export class SimulationActivityService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/activity/';

    // atividade
    this.loadingEvent = 'moduleCf-simulation-activity';
  }

  /**
   * solicita os dados
   * @return {Observable<SimulationActivity>} objeto com os dados
   */
  public loadData(): Observable<SimulationActivity[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new SimulationActivity(obj) );
        }

        // orderna
        objs.sort((a, b) => a.id - b.id);

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {SimulationActivity} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: SimulationActivity): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {SimulationActivity} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: SimulationActivity): Observable<boolean> {

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
