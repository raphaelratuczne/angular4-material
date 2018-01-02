import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Holiday } from './holiday.model';

@Injectable()
export class HolidayService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/holiday/';
    // url para tipos de feriados
    this.apiUrl = ['types','company/{companyId}/holiday/types'];
    // evento
    this.loadingEvent = 'moduleCf-holiday';
  }

  /**
   * solicita os dados
   * @return {Observable<Holiday>} objeto com os dados
   */
  public loadData(): Observable<Holiday[]> {

    return this._loadData(null, null, null, null, ['{companyId}',this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new Holiday(obj);

          // timestamp para Date
          obj.timestampToDate('holidayDate');
          // adiciona a lista
          objs.push(obj);
        }

        // orderna
        //objs.sort((a, b) => a.id - b.id);

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita os dados
   * @return {Observable<Object>} objeto com os dados
   */
  public loadTypes(): Observable<Object> {

    return this._loadData('types', null, null, null, ['{companyId}',this.authService.getSelectedCompany().id]);

  }

  /**
   * envia os dados
   * @param  {Holiday} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Holiday): Observable<boolean> {

    obj = new Holiday(obj);

    // converte Date para timestamp
    obj.dateToTimestamp('holidayDate');

    return this._sendData(obj, null, null, null, ['{companyId}',this.authService.getSelectedCompany().id]);

  }

  /**
   * altera dados
   * @param  {Holiday} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Holiday): Observable<boolean> {

    obj = new Holiday(obj);
    // converte Date para timestamp
    obj.dateToTimestamp('holidayDate');

    return this._editData(obj, null, obj.id, null, ['{companyId}',this.authService.getSelectedCompany().id]);

  }

  /**
   * exclui dados
   * @param  {number}          id id do item
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id, null, null, ['{companyId}',this.authService.getSelectedCompany().id]);
  }

}
