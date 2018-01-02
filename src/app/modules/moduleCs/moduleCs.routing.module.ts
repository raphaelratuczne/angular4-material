import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleCsComponent } from './moduleCs';
import { ScheduleLessonComponent } from './schedule-lesson';
import { CfcCashComponent } from './cfc-cash';
import { RequisitionComponent } from './requisition';

const moduleCsRoutes: Routes = [
  { path: '', component: ModuleCsComponent, children: [
    { path: 'schedule-lesson', component: ScheduleLessonComponent },
    { path: 'cfc-cash', component: CfcCashComponent },
    { path: 'requisition', component: RequisitionComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(moduleCsRoutes)],
  exports: [RouterModule]
})
export class ModuleCsRoutingModule { }
