import { CommonModel } from 'app/shared';

export class VehicleType extends CommonModel {

  id: number = null;
  description: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
