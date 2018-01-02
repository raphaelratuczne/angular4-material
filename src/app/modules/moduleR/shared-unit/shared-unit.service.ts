import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SharedUnit } from './shared-unit.model';

@Injectable()
export class SharedUnitService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/sharedunit/';
    // evento
    this.loadingEvent = 'moduleR-shared-unit';
  }

  /**
   * solicita os dados
   * @return {Observable<SharedUnit[]>} objeto com os dados
   */
  public loadData(): Observable<SharedUnit[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new SharedUnit(obj) );
        }
        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {SharedUnit}           obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: SharedUnit): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {SharedUnit}           obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public editData(obj: SharedUnit): Observable<boolean> {

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
