import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared';

import { LoginRoutingModule } from './login.routing.module';
import { LoginComponent } from './login';
import { NewPassComponent } from './new-pass';
import { ViewComponent } from './view';

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent,
    NewPassComponent,
    ViewComponent,
  ],
  providers: []
})
export class LoginModule { }
