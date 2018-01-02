import { CommonModel, City } from 'app/shared';

export class DrivingSchool extends CommonModel {

  id: number = null;
  company: Company = new Company(null);

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
};

export class Company extends CommonModel {

  id: number = null;
  cnpj: string = null;
  email: string = null;
  name: string = null;
  phoneNumber: string = null;
  stateModuleR: string = null;
  tradingName: string = null;
  address: Address = new Address(null);

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
};

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
