import { CommonModel } from 'app/shared';

export class Holiday extends CommonModel {

  id: number = null;
  holidayDate: number | Date = null;
  description: string = null;
  type: number = null;

  // lista de tipos de feriados
  typesList?: Object;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
