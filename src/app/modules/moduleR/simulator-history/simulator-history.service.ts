import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulatorHistory } from './simulator-history.model';

@Injectable()
export class SimulatorHistoryService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    // servico de delete
    this.apiUrl = ['delete', 'admin/simulator/history/'];
    // evento
    this.loadingEvent = 'moduleR-simulator-history';
  }

  /**
   * solicita os dados do simulador
   * @param {number}                          simulatorId id do simulador
   * @return {Observable<SimulatorHistory[]>}             objeto com os dados
   */
  public loadData(simulatorId?:number): Observable<SimulatorHistory[]> {
    if ( simulatorId ) {
      // seta a url aqui para moduleCsar o cache
      this.apiUrl = [String(simulatorId), `admin/simulator/${simulatorId}/`];

      return this._loadData(String(simulatorId), 'history/')
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new SimulatorHistory(obj);

          // converte datas
          obj.timestampToDate('startDate');
          obj.timestampToDate('endDate');

          // adiciona a lista
          objs.push( obj );
        }
        // console.log(objs);
        return objs;
      } );

    } else {
      return Observable.of(null);
    }
  }

  /**
   * envia os dados
   * @param  {SimulatorHistory}     obj         objeto de dados
   * @param  {number}               simulatorId id do simulador
   * @return {Observable<boolean>}              resposta do servidor
   */
  public sendData(obj: SimulatorHistory, simulatorId:number): Observable<boolean> {

    // seta a url aqui para salvar em cache
    this.apiUrl = [String(simulatorId), `admin/simulator/${simulatorId}/`];

    obj = new SimulatorHistory(obj);

    // converte as datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');

    // cria um body somente com os campos necessarios
    const body = {
      startDate: obj.startDate,
    	endDate: obj.endDate,
    	company: {
    		id: obj.company.id
    	},
    	simulator: {
    		id: obj.simulator.id
    	},
    	softwareVersion: {
    		id: obj.softwareVersion.id
    	}
    };

    return this._sendData(body, String(simulatorId), 'history/');

  }

  /**
   * altera dados
   * @param  {SimulatorHistory}     obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public editData(obj: SimulatorHistory): Observable<boolean> {

    obj = new SimulatorHistory(obj);

    // converte as datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');

    // cria um body somente com os campos necessarios
    const body = {
      id: obj.id,
      startDate: obj.startDate,
      endDate: obj.endDate,
      company: {
        id: obj.company.id
      },
      simulator: {
        id: obj.simulator.id
      },
      softwareVersion: {
        id: obj.softwareVersion.id
      }
    };

    return this._editData(body, String(obj.simulator.id), `history/${obj.id}`);

  }

  /**
   * exclui dados
   * @param  {number}               id id do item
   * @return {Observable<boolean>}     resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id, 'delete');

  }

}
