import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';

import { SharedModule } from 'app/shared';

import { ModuleFRoutingModule } from './moduleF.routing.module';
import { ModuleFComponent } from './moduleF';
import { CreditEntryComponent,
         CreditService,
         CreditReverseDialogComponent } from './credit-entry';
import { BonusEntryComponent,
         BonusService,
         BonusReverseDialogComponent } from './bonus-entry';
import { ContractComponent,
         ContractService,
         ContractDialogComponent } from './contract';
import { ManageBonusComponent } from './manage-bonus';
import { ManageCreditComponent } from './manage-credit';

import { UserService } from '../moduleCf/user';
import { UserTypeService } from '../moduleCf/user-type';
import { DrivingSchoolService } from '../moduleR/driving-school';

import { SystemService } from '../moduleCf/system';

@NgModule({
  imports: [
    ModuleFRoutingModule,
    SharedModule,
    FileUploadModule,
  ],
  declarations: [
    ModuleFComponent,
    CreditEntryComponent,
    CreditReverseDialogComponent,
    ContractComponent,
    ContractDialogComponent,
    ManageBonusComponent,
    ManageCreditComponent,
    BonusEntryComponent,
    BonusReverseDialogComponent
  ],
  providers: [
    ContractService,
    UserService,
    UserTypeService,
    DrivingSchoolService,
    BonusService,
    CreditService,
    SystemService
  ],
  entryComponents: [
    ContractDialogComponent,
    BonusReverseDialogComponent,
    CreditReverseDialogComponent
  ]
})
export class ModuleFModule { }
