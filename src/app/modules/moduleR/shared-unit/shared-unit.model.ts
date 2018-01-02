import { CommonModel } from 'app/shared';
import { DrivingSchool, Company } from '../driving-school/driving-school.model';

export class SharedUnit extends CommonModel {

  id: number = null;
  scheduleAccessEnabled: boolean = null;
  scheduleAccessReadOnly: boolean = null;
  company: Company = null;
  relatedDrivingSchools: DrivingSchool[] = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.company = new Company(this.company);
    for (let ds in this.relatedDrivingSchools)
      this.relatedDrivingSchools[ds] = new DrivingSchool(this.relatedDrivingSchools[ds]);
  }
}
