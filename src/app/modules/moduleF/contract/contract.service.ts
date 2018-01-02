import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Contract } from './contract.model';

@Injectable()
export class ContractService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/contract/';
    // valores da conta
    this.apiUrl = ['account','admin/account/ds/'];
    // evento
    this.loadingEvent = 'moduleF-contract';
  }

  /**
   * solicita os dados
   * @return {Observable<Contract[]>} objeto com os dados
   */
  public loadData(): Observable<Contract[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {

          obj = new Contract(obj);
          // converte as datas
          obj.timestampToDate('startDate');
          obj.timestampToDate('endDate');
          // moeda
          obj.numberToMoney('lessonPrice');

          // adiciona a lista
          objs.push( obj );
        }
        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {Contract}           obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Contract): Observable<boolean> {

    obj = new Contract(obj);
    // converte as datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');
    // tipo numero
    obj.stringToNumber('advanceDaysToAlert');
    // converte o valor de dinheiro
    obj.moneyToNumber('lessonPrice');

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {Contract}           obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public editData(obj: Contract): Observable<boolean> {

    obj = new Contract(obj);
    // converte as datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');
    // tipo numero
    obj.stringToNumber('advanceDaysToAlert');
    // converte o valor de dinheiro
    obj.moneyToNumber('lessonPrice');

    return this._editData(obj, null, obj.id);

  }

  /**
   * cancela o contrato
   * @param  {number}          id id do item
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    const posUrl = id + '/cancel';

    // return this._deleteData(id);
    // para cancelar o contrato, faz uma chamada PUT
    return this._editData(null, null, posUrl);

  }

}
