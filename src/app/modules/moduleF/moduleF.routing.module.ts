import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleFComponent } from './moduleF';
import { ContractComponent } from './contract';
import { CreditEntryComponent } from './credit-entry';
import { BonusEntryComponent } from './bonus-entry';
import { ManageCreditComponent } from './manage-credit';
import { ManageBonusComponent } from './manage-bonus';

const moduleFRoutes: Routes = [
  { path: '', component: ModuleFComponent, children: [
    { path: 'contract', component: ContractComponent },
    { path: 'credit-entry', component: CreditEntryComponent },
    { path: 'bonus-entry', component: BonusEntryComponent },
    { path: 'manage-credits', component: ManageCreditComponent },
    { path: 'manage-bonus', component: ManageBonusComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(moduleFRoutes)],
  exports: [RouterModule]
})
export class ModuleFRoutingModule { }
