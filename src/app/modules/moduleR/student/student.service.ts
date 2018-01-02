import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Student } from './student.model';

@Injectable()
export class StudentService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/student/';
    // evento
    this.loadingEvent = 'moduleR-student';
  }

  /**
   * solicita os dados
   * @return {Observable<Student>} objeto com os dados
   */
  public loadData(): Observable<Student[]> {

    return this._loadData(null, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {

          obj = new Student(obj);

          // converte campo de data
          obj.person.timestampToDate('birthDate');
          obj.person.timestampToDate('rgExpeditionDate');

          // adiciona a lista
          objs.push( new Student(obj) );
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * envia os dados
   * @param  {Student}              obj objeto de dados
   * @return {Observable<boolean>}      resposta do servidor
   */
  public sendData(obj: Student): Observable<boolean> {

    obj = new Student(obj);
    // converte campo de data
    obj.person.dateToTimestamp('birthDate');
    obj.person.dateToTimestamp('rgExpeditionDate');

    // se nao selecionou o estado, anula o campo
    if ( !obj.person.rgState.id )
      obj.person.rgState = null;

    // se nao passou o endereco, anula o campo
    if ( !obj.person.address.zipcode )
      obj.person.address = null;

    return this._sendData(obj, null, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * altera dados
   * @param  {Student} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Student): Observable<boolean> {

    obj = new Student(obj);
    // converte campo de data
    obj.person.dateToTimestamp('birthDate');
    obj.person.dateToTimestamp('rgExpeditionDate');

    // se nao selecionou o estado, anula o campo
    if ( !obj.person.rgState.id )
      obj.person.rgState = null;

    // se nao passou o endereco, anula o campo
    if ( !obj.person.address.zipcode )
      obj.person.address = null;

    return this._editData(obj, null, obj.id, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * exclui dados
   * @param  {number}               id  id do item
   * @return {Observable<boolean>}      resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    return this._deleteData(id, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

}
