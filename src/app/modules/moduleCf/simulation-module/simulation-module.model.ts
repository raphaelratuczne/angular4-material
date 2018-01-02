import { CommonModel } from 'app/shared';
import { SoftwareVersion } from '../software-version';
import { SimulationExercise } from '../simulation-exercise';

export class SimulationModule extends CommonModel {

  id: number = null;
  description: string = null;
  identifierOnDepartment: string = null;
  exercises: SimulationExercise[] = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
    for (let i in this.exercises)
      this.exercises[i] = new SimulationExercise(this.exercises[i]);
  }
}
