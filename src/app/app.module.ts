import * as $ from 'jquery';
// import 'hammerjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from '@angular/material';
// import { Md2Module } from 'md2/module';
// import { FormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
// import { MainModule } from './modules/main.module';
import {
  LoadingEventsService,
  StateService,
  CityService,
  AuthService,
  AuthGuard,
  ChildGuard,
  ConfirmDialogComponent,
  SharedModule
} from './shared';

@NgModule({
  imports: [
    BrowserModule,
    // MaterialModule,
    // Md2Module,
    // FormsModule,
    // FlexLayoutModule,
    // MainModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [
    LoadingEventsService,
    StateService,
    CityService,
    AuthService,
    AuthGuard,
    ChildGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
