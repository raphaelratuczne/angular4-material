import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Instructor } from './instructor.model';

@Injectable()
export class InstructorService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/instructor/';
    // evento
    this.loadingEvent = 'moduleR-instructor';
  }

  /**
   * solicita os dados
   * @return {Observable<Instructor[]>} objeto com os dados
   */
  public loadData(): Observable<Instructor[]> {

    return this._loadData(null, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {

          obj = new Instructor(obj);

          // converte campo de data
          obj.person.timestampToDate('birthDate');
          obj.person.timestampToDate('rgExpeditionDate');

          // adiciona a lista
          objs.push( new Instructor(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {Instructor}              obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Instructor): Observable<boolean> {

    obj = new Instructor(obj);
    // converte campo de data
    obj.person.dateToTimestamp('birthDate');
    obj.person.dateToTimestamp('rgExpeditionDate');
    // converte campo booleano
    obj.nullToBoolean('authPraticalLesson');
    obj.nullToBoolean('authSimulatorLesson');
    obj.nullToBoolean('authTheoricalLesson');

    // se nao selecionou o estado, anula o campo
    if ( !obj.person.rgState.id )
      obj.person.rgState = null;

    return this._sendData(obj, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * altera dados
   * @param  {Instructor} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Instructor): Observable<boolean> {

    obj = new Instructor(obj);
    // converte campo de data
    obj.person.dateToTimestamp('birthDate');
    obj.person.dateToTimestamp('rgExpeditionDate');
    // converte campo booleano
    obj.nullToBoolean('authPraticalLesson');
    obj.nullToBoolean('authSimulatorLesson');
    obj.nullToBoolean('authTheoricalLesson');

    // se nao selecionou o estado, anula o campo
    if ( !obj.person.rgState.id )
      obj.person.rgState = null;

    return this._editData(obj, null, obj.id, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * exclui dados
   * @param  {number}               id  id do item
   * @return {Observable<boolean>}      resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

}
