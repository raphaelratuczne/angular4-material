import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { UserType } from './user-type.model';

@Injectable()
export class UserTypeService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/usertype/';
    // evento
    this.loadingEvent = 'configuraction-user-type';
  }

  /**
   * solicita os dados
   * @return {Observable<UserType>} objeto com os dados
   */
  public loadData(): Observable<UserType[]> {

    return this._loadData(null, null, null, null, ['{companyId}',this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new UserType(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {UserType} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: UserType): Observable<boolean> {

    return this._sendData(obj, null, null, null, ['{companyId}',this.authService.getSelectedCompany().id]);

  }

  /**
   * altera dados
   * @param  {UserType} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: UserType): Observable<boolean> {

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
