import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { VehicleModel } from './vehicle-model.model';

@Injectable()
export class VehicleModelService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/vehiclemodel/';
    // evento
    this.loadingEvent = 'moduleCf-vehicle-model';
  }

  /**
   * solicita os dados
   * @return {Observable<VehicleModel>} objeto com os dados
   */
  public loadData(): Observable<VehicleModel[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new VehicleModel(obj) );
        }

        // orderna
        objs.sort((a, b) => a.id - b.id);

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {VehicleModel} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: VehicleModel): Observable<boolean> {

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {VehicleModel} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: VehicleModel): Observable<boolean> {

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
