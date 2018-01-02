import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Bonus, BonusTypes } from './bonus.model';

@Injectable()
export class BonusService extends CommonService {

  // cache de dados
  private listCache = new Map();

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    // add bonus
    this.apiUrl = 'admin/bonusentry/';
    // evento
    this.loadingEvent = 'moduleF-bonus';

  }

  /**
   * solicita os dados
   * @param {number}                drivingSchool  id do cfc
   * @param {Object}                filter         filtros
   * @return {Observable<Bonus[]>}                 objeto com os dados
   */
  public loadData(drivingSchool:number, filter:{ last?:number,
                                                  initialTimestamp?:Date,
                                                  finalTimestamp?:Date
                                                }): Observable<Bonus[]> {
    // verifica se tem cache
    if ( filter.last && this.listCache !== null && this.listCache.has(drivingSchool) ) {
      return Observable.of(this.listCache.get(drivingSchool));
    }

    // dandos que vao na url
    let posUrl = `ds/${drivingSchool}/`;
    if ( filter.last )
      posUrl += `last/${filter.last}`;
    else
      posUrl += `filter?initialTimestamp=${filter.initialTimestamp.getTime()}&finalTimestamp=${filter.finalTimestamp.getTime()}`;

    return this._loadData(null, posUrl, false)
      .map( res => {
        let objs = [];
        for (let obj of res) {

          obj = new Bonus(obj);
          // converte data
          obj.timestampToDate('entryDate');

          // adiciona a lista
          objs.push( obj );
        }
        // console.log(objs);

        // guarda em cache
        if (filter.last)
          this.listCache.set(drivingSchool, objs);

        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {Bonus}                obj             objeto de dados
   * @param  {number}               drivingSchool   id do cfc
   * @return {Observable<boolean>}                  resposta do servidor
   */
  public sendData(obj:Bonus, drivingSchool:number): Observable<boolean> {

    // envia o id do cfc pela url
    const posUrl = `ds/${drivingSchool}/`;
    // dados para enviar
    const body = {
      justification: obj.justification,
      bonusValue: obj.bonusValue
    };

    return this._sendData(body, null, posUrl)
      .flatMap( res => {
        // limpa o cache
        this.listCache.delete(drivingSchool);
        return Observable.of(res);
      } );

  }

  /**
   * aproveita essa funcao para fazer o estorno
   * @param  {number}              bonusId        id do bonus
   * @param  {string}              justification  justificativa
   * @return {Observable<boolean>}                resposta do servidor
   */
  public editData(bonusId:number, justification:string): Observable<boolean> {

    // envia o id do bonusId pela url
    const posUrl = `${bonusId}/reverse`;
    // dados para enviar
    const body = {
      justification: justification
    };

    return this._editData(body, null, posUrl)
      .flatMap( res => {
        // limpa o cache
        this.listCache.clear();
        return Observable.of(res);
      });

  }

  /**
   * essa funcao nao funciona
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(): Observable<boolean> {

    return Observable.of(false);
    // return this._deleteData(id);

  }

}
