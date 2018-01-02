import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SmtpServer } from './smtp-server.model';

@Injectable()
export class SmtpServerService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    this.apiUrl = 'admin/smtpserver';
    // url para envio de email de teste
    this.apiUrl = ['apiUrlEmail', 'admin/smtpserver/test/?destinatary='];
    // evento
    this.loadingEvent = 'moduleCf-smtp-server';
  }

  /**
  * solicita os dados
  * @return {Observable<SmtpServer>} objeto com os dados
  */
  public loadData(): Observable<SmtpServer> {

    return this._loadData()
      .map( res => new SmtpServer(res) );

  }

  /**
   * envia os dados
   * @param  {SmtpServer}         obj objeto de dados
   * @return {Observable<boolean>}         resposta do servidor
   */
  public sendData(obj: SmtpServer): Observable<boolean> {
    // let body = new SmtpServer(obj);
    return this._sendData(obj);
  }

  /**
   * TODO envia email de teste
   * @param  {string}          email
   * @return {Observable<boolean>}       resposta
   */
  public sendEmail(email: string): Observable<boolean> {

    return this._loadData('apiUrlEmail', email, false, 'status');

  }

  editData() { return Observable.of(true); }

  deleteData() { return Observable.of(true); }

}
