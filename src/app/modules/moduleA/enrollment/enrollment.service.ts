import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { Enrollment, Account } from './enrollment.model';
import { Contract } from '../../moduleF/contract';

@Injectable()
export class EnrollmentService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'company/{companyId}/student/{studentId}/enrollment';
    // retorna dados de uma conta
    this.apiUrl = ['account', 'company/{companyId}/account'];
    // retorna dados do contrato atual
    this.apiUrl = ['current', 'company/{companyId}/contract/current'];
    // cancela uma matricula
    this.apiUrl = ['cancel', 'company/{companyId}/enrollment/{enrollmentId}/cancel'];
    // evento
    this.loadingEvent = 'moduleA-enrollment';
  }

  /**
   * solicita os dados
   * @param {number}                  studentId id do usuario
   * @return {Observable<Enrollment>}           objeto com os dados
   */
  public loadData(studentId:number): Observable<Enrollment[]> {

    return this._loadData(null, null, null, null, [/{companyId}|{studentId}/g, s => (s == '{companyId}') ? this.authService.getSelectedCompany().id : studentId])
      .map( res => {
        let objs = [];
        for (let obj of res) {

          // adiciona a lista
          objs.push( new Enrollment(obj) );
        }

        console.log(objs);
        return objs;
      } );

  }

  /**
   * retorna dados da conta da empresa
   * @return {Observable<Account>}
   */
  public loadAccount(): Observable<Account> {

    return this._loadData('account', null, false, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let obj = new Account(res);
        // converte valor de dinheiro
        obj.numberToMoney('cashBalance');

        return obj;
      } );

  }

  /**
   * retorna dados do contrato atual da empresa
   * @return {Observable<Contract>}
   */
  public loadCurrent(): Observable<Contract> {

    return this._loadData('current', null, false, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let obj = new Contract(res);

        // converte as datas
        obj.timestampToDate('startDate');
        obj.timestampToDate('endDate');
        // moeda
        obj.numberToMoney('lessonPrice');

        return obj;
      } );

  }

  /**
   * envia os dados
   * @param  {Enrollment}           obj       objeto de dados
   * @param  {number}               studentId objeto de dados
   * @return {Observable<boolean>}            resposta do servidor
   */
  public sendData(obj: Enrollment, studentId:number): Observable<boolean> {

    const body = {
      lessonsCategory: obj.lessonsCategory,
      lessonsType: obj.lessonsType,
      numLessonsLoaded: +obj.numLessonsLoaded,
      paymentType: (obj.lessonsType !== 2 ? obj.paymentType : null),
      departmentProcessNumber: (obj.lessonsType === 0 ? obj.departmentProcessNumber : null)
    };

    return this._sendData(body, null, null, 'json', [/{companyId}|{studentId}/g, s => (s == '{companyId}') ? this.authService.getSelectedCompany().id : studentId]);

  }

  /**
   * altera dados
   * @param  {Enrollment} obj objeto de dados
   * @return {Observable<boolean>}              resposta do servidor
   */
  public editData(obj: Enrollment): Observable<boolean> {

    return Observable.of(true);
    // obj = new Enrollment(obj);
    // return this._editData(obj, null, obj.id, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * cancela uma matricula
   * @param  {number}               id  id do item
   * @return {Observable<boolean>}      resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    // faz uma chamada PUT
    return this._editData(null, 'cancel', null, null, [/{companyId}|{enrollmentId}/g, s => (s == '{companyId}') ? this.authService.getSelectedCompany().id : id]);
    // return this._deleteData(id, null, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

}
