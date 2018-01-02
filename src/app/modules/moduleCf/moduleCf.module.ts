import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared';

import { ModuleCfRoutingModule } from './moduleCf.routing.module';
import { ModuleCfComponent } from './moduleCf/moduleCf.component';
import { SimulationActivityComponent,
         SimulationActivityService,
         SimulationActivityDialogComponent } from './simulation-activity';
import { SimulationModuleComponent,
         SimulationModuleService,
         SimulationModuleDialogComponent,
         SimulationModuleCloneDialogComponent } from './simulation-module';
import { SimulationEventComponent,
         SimulationEventService,
         SimulationEventDialogComponent } from './simulation-event';
import { SimulationExerciseComponent,
         SimulationExerciseService,
         SimulationExerciseDialogComponent,
         SimulationExerciseCloneDialogComponent } from './simulation-exercise';
import { HolidayComponent,
         HolidayService,
         HolidayDialogComponent } from './holiday';
import { InfractionComponent,
         InfractionService,
         InfractionDialogComponent } from './infraction';
import { UserTypeComponent,
         UserTypeService,
         UserTypeDialogComponent } from './user-type';
import { VehicleTypeComponent,
         VehicleTypeDialogComponent,
         VehicleTypeService } from './vehicle-type';
import { VehicleModelComponent,
         VehicleModelDialogComponent,
         VehicleModelService } from './vehicle-model';
import { UserComponent,
         UserService,
         UserDialogComponent } from './user';
import { SoftwareVersionComponent,
         SoftwareVersionDialogComponent,
         SoftwareVersionService } from './software-version';
import { DepartmentComponent,
         DepartmentService } from './department';
import { SmtpServerComponent,
         SmtpServerService,
         EmailDialogComponent } from './smtp-server';
import { SystemComponent,
         SystemService } from './system';

@NgModule({
  imports: [
    ModuleCfRoutingModule,
    SharedModule,
  ],
  declarations: [
    ModuleCfComponent,
    SimulationModuleComponent,
    SimulationModuleDialogComponent,
    SimulationModuleCloneDialogComponent,
    SimulationEventComponent,
    SimulationEventDialogComponent,
    SimulationExerciseComponent,
    SimulationExerciseDialogComponent,
    SimulationExerciseCloneDialogComponent,
    HolidayComponent,
    HolidayDialogComponent,
    InfractionComponent,
    InfractionDialogComponent,
    VehicleModelComponent,
    UserTypeComponent,
    UserTypeDialogComponent,
    VehicleTypeComponent,
    VehicleTypeDialogComponent,
    VehicleModelComponent,
    VehicleModelDialogComponent,
    UserComponent,
    UserDialogComponent,
    SoftwareVersionComponent,
    SoftwareVersionDialogComponent,
    DepartmentComponent,
    SmtpServerComponent,
    EmailDialogComponent,
    SystemComponent,
    SimulationActivityComponent,
    SimulationActivityDialogComponent,
  ],
  providers: [
    UserService,
    SimulationEventService,
    SimulationExerciseService,
    SimulationModuleService,
    HolidayService,
    InfractionService,
    SoftwareVersionService,
    DepartmentService,
    SmtpServerService,
    SystemService,
    UserTypeService,
    VehicleTypeService,
    VehicleModelService,
    SimulationActivityService,
  ],
  entryComponents: [
    UserDialogComponent,
    SimulationModuleDialogComponent,
    SimulationModuleCloneDialogComponent,
    SimulationEventDialogComponent,
    SimulationExerciseDialogComponent,
    HolidayDialogComponent,
    InfractionDialogComponent,
    SimulationExerciseCloneDialogComponent,
    SoftwareVersionDialogComponent,
    UserTypeDialogComponent,
    VehicleTypeDialogComponent,
    VehicleModelDialogComponent,
    EmailDialogComponent,
    SimulationActivityDialogComponent,
  ]
})
export class ModuleCfModule { }
