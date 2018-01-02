import { CommonModel } from 'app/shared';
import { User } from '../../moduleCf/user';
import { Company } from '../../moduleR/driving-school';

export class Enrollment extends CommonModel {

  id?: number = null;
  lessonsCategory: number = null;
  lessonsType: number = null;
  numLessonsLoaded: number = null;
  paymentType: number = null;
  departmentProcessNumber: string = null;

  status?: number = null;
  enrollmentDate?: string|number|Date = null;
  totalValueOfContract?: any = null;
  scheduledlessons?: any = null;
  user?: User = null;
  company?: Company = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);

    if ( this.user != null )
      this.user = new User(this.user);
    if ( this.company != null )
      this.company = new Company(this.company);

  }
}

export class Account extends CommonModel {

  id: number = null;
  bonusBalance: number = null;
  cashBalance: number|string = null;
  description: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
