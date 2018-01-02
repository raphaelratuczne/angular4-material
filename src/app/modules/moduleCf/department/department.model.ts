import { CommonModel } from 'app/shared';
import { State } from 'app/shared';

export class Department extends CommonModel {

  name: string = null;
  state: State | string = null;
  communicationType: string | number = null;
  webserviceAddress: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
