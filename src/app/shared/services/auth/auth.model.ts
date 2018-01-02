import { CommonModel } from '../../common/common.model';
import { City } from '../city/city.model';

/**
 * objeto resultado do login
 */
export class Auth extends CommonModel {

  access_token: string = null;
  expires_in: number = null;
  expires_at?: number = null;
  refresh_token: string = null;
  scope: string = null;
  token_type: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

/**
 * objeto de empresa
 */
export class Company extends CommonModel {

  id: number = null;
  address: Address = null;
  cnpj: string = null;
  email: string = null;
  name: string = null;
  phoneNumber: string = null;
  stateModuleR: any = null;
  tradingName: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export class Address extends CommonModel {

  id: number = null;
  cityArea: string = null;
  complement: string = null;
  number: string = null;
  street: string = null;
  zipcode: string = null;
  city: City = new City();

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
};

export class AuthUser extends CommonModel {

  id: number = null;
  active: boolean = null;
  cpf: string = null;
  email: string = null;
  firstName: string = null;
  lastName: string = null;
  userType: UserType = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.userType = new UserType(this.userType);
  }
}

export class UserType extends CommonModel {

  id: number = null;
  description: string = null;
  permissions: Permission[] = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    for (let i in this.permissions)
      this.permissions[i] = new Permission(this.permissions[i]);
  }
}

export class Permission extends CommonModel {

  id: number = null;
  authCreate: boolean = null;
  authDelete: boolean = null;
  authRead: boolean = null;
  authUpdate: boolean = null;
  feature: Feature = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.feature = new Feature(this.feature);
  }
}

export class Feature extends CommonModel {

  id: number = null;
  enabledInAdminArea: boolean = null;
  enabledInSchoolArea: boolean = null;
  description: string = null;
  role: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
