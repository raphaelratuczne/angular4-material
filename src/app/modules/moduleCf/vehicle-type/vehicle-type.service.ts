import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { VehicleType } from './vehicle-type.model';

@Injectable()
export class VehicleTypeService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/vehicletype/';
    // evento
    this.loadingEvent = 'moduleCf-vehicle-type';
  }

  /**
   * solicita os dados
   * @return {Observable<VehicleType>} objeto com os dados
   */
  public loadData(): Observable<VehicleType[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new VehicleType(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {VehicleType} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: VehicleType): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {VehicleType} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: VehicleType): Observable<boolean> {

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
