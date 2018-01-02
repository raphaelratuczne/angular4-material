import { CommonModel } from 'app/shared';
import { VehicleType } from 'app/modules/moduleCf/vehicle-type';

export class Simulators extends CommonModel {

  id: number = null;
  active: boolean = null;
  name: string = null;
  serialNumber: string = null;
  vehicleType: VehicleType = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
