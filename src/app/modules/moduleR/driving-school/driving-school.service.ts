import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { DrivingSchool } from './driving-school.model';

@Injectable()
export class DrivingSchoolService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/drivingschool/';
    // evento
    this.loadingEvent = 'moduleR-driving-school';
  }

  /**
   * solicita os dados
   * @return {Observable<DrivingSchool>} objeto com os dados
   */
  public loadData(): Observable<DrivingSchool[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new DrivingSchool(obj) );
        }
        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {DrivingSchool} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: DrivingSchool): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {DrivingSchool} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: DrivingSchool): Observable<boolean> {

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
