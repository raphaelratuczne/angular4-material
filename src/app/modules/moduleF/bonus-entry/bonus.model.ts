import { CommonModel } from 'app/shared';
import { User } from '../../moduleCf/user';

export class Bonus extends CommonModel {

  justification: string = null;
  bonusValue?: number = null;

  id?: number = null;
  entryDate?: string|number|Date = null;
  reversed?: boolean = null;
  type?: number = null;
  creditValue?: number = null;
  parentAccountEntry?: Bonus = null;
  evidences?: Array<any> = null;
  account?: Account = null;
  user?: User = null;
  category?: number = null;

  drivingSchoolId?: number = null; // temporario
  drivingSchoolname?: string = null; // temporario

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export class Account extends CommonModel {

  id: number = null;
  bonusBalance: number = null;
  cashBalance: number = null;
  description: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export const BonusTypes = {
  0: 'Crédito',   // Crédito
  1: 'Débito',    // Débito
  2: 'Crédito',   // Crédito manual
  3: 'Estorno',   // Estorno manual
  4: 'Estorno',   // Estorno automático
  5: 'Débito',    // Débito manual
};
