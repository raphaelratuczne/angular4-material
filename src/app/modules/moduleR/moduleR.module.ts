import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared';

import { ModuleRRoutingModule } from './moduleR.routing.module';
import { ModuleRComponent } from './moduleR';
import { StudentComponent,
         StudentService,
         StudentDialogComponent,
         EnrollmentDialogComponent,
         EnrollmentListDialogComponent } from './student';
import { SharedUnitComponent,
         SharedUnitService,
         SharedUnitDialogComponent } from './shared-unit';
import { DrivingSchoolComponent,
         DrivingSchoolService,
         DrivingSchoolDialogComponent } from './driving-school';
import { SimulatorHistoryComponent,
         SimulatorHistoryService,
         SimulatorHistoryDialogComponent } from './simulator-history';
import { InstructorComponent,
         InstructorService,
         InstructorDialogComponent } from './instructor';
import { SimulatorsComponent,
         SimulatorsDialogComponent,
         SimulatorsService } from './simulators';
import { VehicleTypeService } from '../moduleCf/vehicle-type';
import { VehicleModelService } from '../moduleCf/vehicle-model';
import { SoftwareVersionService } from '../moduleCf/software-version';

import { EnrollmentService } from '../moduleA/enrollment';

@NgModule({
  imports: [
    ModuleRRoutingModule,
    SharedModule,
  ],
  declarations: [
    ModuleRComponent,
    StudentComponent,
    StudentDialogComponent,
    EnrollmentDialogComponent,
    EnrollmentListDialogComponent,
    SharedUnitComponent,
    SharedUnitDialogComponent,
    DrivingSchoolComponent,
    DrivingSchoolDialogComponent,
    SimulatorHistoryComponent,
    SimulatorHistoryDialogComponent,
    InstructorComponent,
    InstructorDialogComponent,
    SimulatorsComponent,
    SimulatorsDialogComponent,
  ],
  providers: [
    SimulatorsService,
    VehicleTypeService,
    VehicleModelService,
    DrivingSchoolService,
    SharedUnitService,
    SimulatorHistoryService,
    SoftwareVersionService,
    StudentService,
    EnrollmentService,
    InstructorService
  ],
  entryComponents: [
    SimulatorsDialogComponent,
    DrivingSchoolDialogComponent,
    SharedUnitDialogComponent,
    SimulatorHistoryDialogComponent,
    StudentDialogComponent,
    EnrollmentDialogComponent,
    EnrollmentListDialogComponent,
    InstructorDialogComponent
  ]
})
export class ModuleRModule { }
