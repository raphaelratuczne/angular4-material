import { CommonModel } from 'app/shared';

export class User extends CommonModel {

  id: number = null;
  cpf: string = null;
  active: boolean = null;
  firstName: string = null;
  lastName: string = null;
  email: string = null;
  userTypeId: number = null;

  typesList?: any;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
