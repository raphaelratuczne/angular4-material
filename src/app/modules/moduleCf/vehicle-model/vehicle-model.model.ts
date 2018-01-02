import { CommonModel } from 'app/shared';
import { VehicleType } from '../vehicle-type';

export class VehicleModel extends CommonModel {

  id: number = null;
  description: string = null;
  vehicleType: VehicleType = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.vehicleType = new VehicleType(this.vehicleType);
  }
}
