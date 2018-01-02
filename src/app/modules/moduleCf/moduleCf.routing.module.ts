import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleCfComponent } from './moduleCf';
import { SimulationActivityComponent } from './simulation-activity';
import { SimulationModuleComponent } from './simulation-module';
import { SimulationEventComponent } from './simulation-event';
import { SimulationExerciseComponent } from './simulation-exercise';
import { HolidayComponent } from './holiday';
import { InfractionComponent } from './infraction';
import { VehicleModelComponent } from './vehicle-model';
import { UserTypeComponent } from './user-type';
import { VehicleTypeComponent } from './vehicle-type';
import { UserComponent } from './user';
import { SoftwareVersionComponent } from './software-version';
import { DepartmentComponent } from './department';
import { SmtpServerComponent } from './smtp-server';
import { SystemComponent } from './system';

const moduleCfRoutes: Routes = [
  { path: '', component: ModuleCfComponent, children: [
    { path: 'simulation-activity', component: SimulationActivityComponent },
    { path: 'simulation-module', component: SimulationModuleComponent },
    { path: 'simulation-event', component: SimulationEventComponent },
    { path: 'simulation-exercise', component: SimulationExerciseComponent },
    { path: 'holiday', component: HolidayComponent },
    { path: 'infraction', component: InfractionComponent },
    { path: 'vehicle-model', component: VehicleModelComponent },
    { path: 'user-type', component: UserTypeComponent },
    { path: 'vehicle-type', component: VehicleTypeComponent },
    { path: 'user', component: UserComponent },
    { path: 'software-version', component: SoftwareVersionComponent },
    { path: 'department', component: DepartmentComponent },
    { path: 'smtp-server', component: SmtpServerComponent },
    { path: 'system', component: SystemComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(moduleCfRoutes)],
  exports: [RouterModule]
})
export class ModuleCfRoutingModule { }
