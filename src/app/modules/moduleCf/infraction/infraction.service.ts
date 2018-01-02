import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Infraction } from './infraction.model';

@Injectable()
export class InfractionService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/infraction/';
    // url para categorias
    this.apiUrl = ['categories','admin/infraction/categories'];
    // evento
    this.loadingEvent = 'configuraction-infraction';
  }

  /**
   * solicita os dados
   * @return {Observable<Infraction>} objeto com os dados
   */
  public loadData(): Observable<Infraction[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new Infraction(obj) );
        }

        // orderna
        objs.sort((a, b) => a.code - b.code);

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
   * @param  {Infraction} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Infraction): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {Infraction} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Infraction): Observable<boolean> {

    return this._editData(obj, null, obj.code);

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
