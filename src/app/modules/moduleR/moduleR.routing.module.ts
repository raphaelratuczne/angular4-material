import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleRComponent } from './moduleR/moduleR.component';
import { StudentComponent } from './student';
import { SharedUnitComponent } from './shared-unit';
import { DrivingSchoolComponent } from './driving-school';
import { SimulatorHistoryComponent } from './simulator-history';
import { InstructorComponent } from './instructor';
import { SimulatorsComponent } from './simulators';

const moduleRRoutes: Routes = [
  { path: '', component: ModuleRComponent, children: [
    { path: 'student', component: StudentComponent },
    { path: 'shared-unit', component: SharedUnitComponent },
    { path: 'driving-school', component: DrivingSchoolComponent },
    { path: 'simulator-history', component: SimulatorHistoryComponent },
    { path: 'instructor', component: InstructorComponent },
    { path: 'simulators', component: SimulatorsComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(moduleRRoutes)],
  exports: [RouterModule]
})
export class ModuleRRoutingModule { }
