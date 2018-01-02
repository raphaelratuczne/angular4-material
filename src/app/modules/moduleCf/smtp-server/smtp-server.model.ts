import { CommonModel } from 'app/shared';

export class SmtpServer extends CommonModel {

  id: number = null;
  description: string = null;
  server: string = null;
  port: number = null;
  username: string = null;
  password: string = null;
  enableSSL: boolean = null;
  timeout: number = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
