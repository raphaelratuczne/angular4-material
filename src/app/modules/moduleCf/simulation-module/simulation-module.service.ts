import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulationModule } from './simulation-module.model';
import { SoftwareVersion } from '../software-version';

@Injectable()
export class SimulationModuleService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url so servico
    this.apiUrl = 'admin/module/';
    // url para clonar
    this.apiUrl = ['clone','admin/module/clone/'];
    // evento
    this.loadingEvent = 'moduleCf-simulation-module';
  }

  /**
   * solicita os dados
   * @return {Observable<SimulationModule[]>} objeto com os dados
   */
  public loadData(): Observable<SimulationModule[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new SimulationModule(obj) );
        }

        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {SimulationModule} obj objeto de dados
   * @return {Observable<boolean>}    resposta do servidor
   */
  public sendData(obj: SimulationModule): Observable<boolean> {

    return this._sendData( new SimulationModule(obj) );

  }

  /**
   * altera dados
   * @param  {SimulationModule} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: SimulationModule): Observable<boolean> {

    obj = new SimulationModule(obj);

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

  /**
   * clona aulas de uma versão para outra
   * @param  {number}             sourceSoftwareVersionId id da versão de origem
   * @param  {number}             destSoftwareVersionId   id da versão de destino
   * @return {Observable<boolean>}                        resposta da servidor
   */
  public cloneData(sourceSoftwareVersionId: number, destSoftwareVersionId: number): Observable<boolean> {

    // junta os ids das versoes
    const ids = sourceSoftwareVersionId + '/' + destSoftwareVersionId;

    return this._editData({}, 'clone', ids);

  }

}
