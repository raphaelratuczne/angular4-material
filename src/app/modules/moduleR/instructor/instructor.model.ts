import { CommonModel } from 'app/shared';
import { Address } from '../driving-school';

export class Instructor extends CommonModel {

  id: number = null;
  active: boolean = null;
  authPraticalLesson: boolean = null;
  authSimulatorLesson: boolean = null;
  authTheoricalLesson: boolean = null;
  person: Person = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.person = new Person(this.person);
  }
}

export class Person extends CommonModel {

  id: number = null;
  cpf: string = null;
  name: string = null;
  email: string = null;
  birthDate: string|number|Date = null;
  gender: string = null;
  rg: string = null;
  rgExpeditionAgency: string = null;
  rgState: { id:number } = {id:null};
  rgExpeditionDate: string|number|Date = null;
  address: Address = null;
  cellPhoneNumber: string = null;
  phoneNumber: string = null;
  // biometry: any = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);

    this.address = new Address(this.address);

    if ( !this.rgState )
      this.rgState = {id:null};
      
  }
}
