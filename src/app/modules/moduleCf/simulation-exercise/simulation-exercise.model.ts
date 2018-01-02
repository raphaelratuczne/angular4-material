import { CommonModel } from 'app/shared';
import { SoftwareVersion } from '../software-version';

export class SimulationExercise extends CommonModel {

  id: number = null;
  code: number = null;
  description: string = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
  }
}
