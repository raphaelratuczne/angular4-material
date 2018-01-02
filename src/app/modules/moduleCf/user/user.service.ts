import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { User } from './user.model';
import { UserType, UserTypeService } from '../user-type';

@Injectable()
export class UserService extends CommonService {

  constructor(injector:Injector, private userTypeService: UserTypeService) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/user/';
    // url para resetar senha
    this.apiUrl = ['resetpass','user/resetpass/'];
    // evento
    this.loadingEvent = 'moduleCf-user';
  }

  /**
   * solicita os dados
   * @return {Observable<User>} objeto com os dados
   */
  public loadData(): Observable<User[]> {

    return this._loadData(null, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          // adiciona a lista
          objs.push( new User(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita lista de tipos de usuarios
   * @return {Observable<UserType[]>} lista de tipos
   */
  public loadUserTypes(): Observable<UserType[]> {
    return this.userTypeService.loadData();
  }

  /**
   * envia os dados
   * @param  {User} obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: User): Observable<boolean> {

    return this._sendData(obj, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * altera dados
   * @param  {User} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: User): Observable<boolean> {

    return this._editData(obj, null, obj.id, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * exclui dados
   * @param  {number}          id id do item
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * redefine a senha de usuario
   * @param  {string}              cpf
   * @return {Observable<boolean>}
   */
  public resetPass(cpf:string): Observable<boolean> {

    return this._loadData('resetpass', cpf, false, 'status')
      .map( res => res == 200 );

  }

}
