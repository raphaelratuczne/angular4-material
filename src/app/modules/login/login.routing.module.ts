import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { NewPassComponent } from './new-pass';
import { ViewComponent } from './view';

const loginRoutes: Routes = [
  { path: '', component: LoginComponent, children: [
    { path: 'new-pass/:token', component: NewPassComponent },
    { path: 'view', component: ViewComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
