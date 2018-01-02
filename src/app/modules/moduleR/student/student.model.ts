import { CommonModel } from 'app/shared';
import { DrivingSchool, Address } from '../driving-school';
import { Enrollment } from '../../moduleA/enrollment';

export class Student extends CommonModel {

  id: number = null;
  person: Person = null;
  // enrollments: Enrollment[] = null;

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
