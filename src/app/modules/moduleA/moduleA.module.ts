import { NgModule } from '@angular/core';

import { SharedModule, ScheduleModule } from 'app/shared';

import { ModuleARoutingModule } from './moduleA.routing.module';
import { ModuleAComponent } from './moduleA';
import { SimulationLessonComponent,
         SimulationLessonService,
         SimulationLessonDialogComponent } from './simulation-lesson';
import { EnrollmentComponent,
         EnrollmentService } from './enrollment';

import { StudentService } from '../moduleR/student';
import { SystemService } from '../moduleCf/system';
import { HolidayService } from '../moduleCf/holiday';
import { VehicleModelService } from '../moduleCf/vehicle-model';

@NgModule({
  imports: [
    ModuleARoutingModule,
    SharedModule,
    ScheduleModule
  ],
  declarations: [
    ModuleAComponent,
    SimulationLessonComponent,
    SimulationLessonDialogComponent,
    EnrollmentComponent
  ],
  providers: [
    EnrollmentService,
    StudentService,
    SimulationLessonService,
    SystemService,
    HolidayService,
    VehicleModelService
  ],
  entryComponents: [
    SimulationLessonDialogComponent
  ]
})
export class ModuleAModule { }
