import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SoftwareVersion } from './software-version.model';

@Injectable()
export class SoftwareVersionService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/softwareversion/';
    // evento
    this.loadingEvent = 'moduleCf-software-version';
  }

  /**
   * solicita os dados
   * @return {Observable<SoftwareVersion>} objeto com os dados
   */
  public loadData(): Observable<SoftwareVersion[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new SoftwareVersion(obj);
          // timestamp para Date
          obj.timestampToDate('releaseDate');
          // adiciona a lista
          objs.push( obj );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {SoftwareVersion} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: SoftwareVersion): Observable<boolean> {

    obj = new SoftwareVersion(obj);
    // converte Date para timestamp
    obj.dateToTimestamp('releaseDate');

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {SoftwareVersion} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: SoftwareVersion): Observable<boolean> {

    obj = new SoftwareVersion(obj);
    // converte Date para timestamp
    obj.dateToTimestamp('releaseDate');

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
