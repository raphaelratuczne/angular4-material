import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { System } from './system.model';

@Injectable()
export class SystemService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/config/';
    // evento
    this.loadingEvent = 'moduleCf-system';
  }

  /**
   * solicita os dados
   * @return {Observable<System>} objeto com os dados
   */
  public loadData(): Observable<System> {

    return this._loadData()
      .map( res => {

        let obj = new System(res);
        // converte valores de hora
        obj.timestampToDate('scheduleOpenTime');
        obj.timestampToDate('scheduleCloseTime');
        // converte os valores recebidos para boolean (1:true, 2:false)
        obj.lessonScheduler = obj.lessonScheduler === 0 ? true : false;

        return obj;
      } );

  }

  /**
   * envia os dados
   * @param  {System}          obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj:System): Observable<boolean> {

    obj = new System(obj);
    // converte string hour para timestamp
    obj.dateToTimestamp('scheduleOpenTime');
    obj.dateToTimestamp('scheduleCloseTime');
    // converte os valores recebidos para boolean (1:true, 2:false)
    obj.lessonScheduler = obj.lessonScheduler ? 0 : 1;

    return this._sendData(obj);

  }

  deleteData(id:number): Observable<boolean> {
    return Observable.of(true);
  }

  editData(): Observable<boolean> {
    return Observable.of(true);
  }

}
