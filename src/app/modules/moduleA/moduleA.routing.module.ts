import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleAComponent } from './moduleA';
import { SimulationLessonComponent } from './simulation-lesson';
import { EnrollmentComponent } from './enrollment';

const moduleARoutes: Routes = [
  { path: '', component: ModuleAComponent, children: [
    { path: 'simulation-lesson', component: SimulationLessonComponent },
    { path: 'enrollment', component: EnrollmentComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(moduleARoutes)],
  exports: [RouterModule]
})
export class ModuleARoutingModule { }
