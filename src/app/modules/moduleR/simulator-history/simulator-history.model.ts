import { CommonModel } from 'app/shared';
import { Company } from '../driving-school';
import { Simulators } from '../simulators';
import { SoftwareVersion } from '../../moduleCf/software-version';

export class SimulatorHistory extends CommonModel {

  id: number = null;
  endDate: string|number|Date = null;
  startDate: string|number|Date = null;
  company: Company = null;
  simulator: Simulators = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.company = new Company(this.company);
    this.simulator = new Simulators(this.simulator);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
  }
}
