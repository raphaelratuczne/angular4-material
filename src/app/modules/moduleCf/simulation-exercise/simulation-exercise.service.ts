import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulationExercise } from './simulation-exercise.model';
import { SoftwareVersion } from '../software-version';

@Injectable()
export class SimulationExerciseService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url so servico
    this.apiUrl = 'admin/exercise/';
    // url para clonar
    this.apiUrl = ['clone','admin/exercise/clone/'];
    // evento
    this.loadingEvent = 'moduleCf-simulation-exercise';
  }

  /**
   * solicita os dados
   * @return {Observable<SimulationExercise>} objeto com os dados
   */
  public loadData(): Observable<SimulationExercise[]> {

    return this._loadData()
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new SimulationExercise(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {SimulationExercise} obj objeto de dados
   * @return {Observable<boolean>}    resposta do servidor
   */
  public sendData(obj: SimulationExercise): Observable<boolean> {

    obj = new SimulationExercise(obj);
    // converte o releaseDate de softwareVersion de date para timestamp
    obj.softwareVersion.dateToTimestamp('releaseDate');

    return this._sendData(obj);

  }

  /**
   * altera dados
   * @param  {SimulationExercise} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: SimulationExercise): Observable<boolean> {

    obj = new SimulationExercise(obj);
    // converte o releaseDate de softwareVersion de date para timestamp
    obj.softwareVersion.dateToTimestamp('releaseDate');

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
   * clona exercicios de uma versão para outra
   * @param  {number}          idSource id da versão de origem
   * @param  {number}          idDest   id da versão de destino
   * @return {Observable<boolean>}          resposta da servidor
   */
  public cloneData(sourceSoftwareVersionId: number, destSoftwareVersionId: number): Observable<boolean> {

    // junta os ids das versoes
    const ids = sourceSoftwareVersionId + '/' + destSoftwareVersionId;

    return this._editData({}, 'clone', ids);

  }

}
