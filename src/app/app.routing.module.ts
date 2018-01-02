import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, ChildGuard } from './shared';

const appRouts: Routes = [
  { path: 'login',
    loadChildren: 'app/modules/login/login.module#LoginModule' },
  { path: 'dashboard',
    loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: 'moduleA',
    loadChildren: 'app/modules/moduleA/moduleA.module#ModuleAModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: 'moduleR',
    loadChildren: 'app/modules/moduleR/moduleR.module#ModuleRModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: 'moduleCf',
    loadChildren: 'app/modules/moduleCf/moduleCf.module#ModuleCfModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: 'moduleCs',
    loadChildren: 'app/modules/moduleCs/moduleCs.module#ModuleCsModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: 'moduleF',
    loadChildren: 'app/modules/moduleF/moduleF.module#ModuleFModule',
    canActivate: [AuthGuard],
    canActivateChild: [ChildGuard],
    canLoad: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRouts, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
