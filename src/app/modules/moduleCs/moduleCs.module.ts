import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared';

import { ModuleCsRoutingModule } from './moduleCs.routing.module';
import { ModuleCsComponent } from './moduleCs';
import { ScheduleLessonComponent } from './schedule-lesson';
import { CfcCashComponent } from './cfc-cash';
import { RequisitionComponent } from './requisition';

@NgModule({
  imports: [
    ModuleCsRoutingModule,
    SharedModule
  ],
  declarations: [
    ModuleCsComponent,
    ScheduleLessonComponent,
    CfcCashComponent,
    RequisitionComponent
  ]
})
export class ModuleCsModule { }
