import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { AuthService } from '../services/auth/auth.service';

export class confirmDialogModel {
  title?: string = null;
  subTitle?: string = null;
  text?: string = null;
  buttonOk?: string = null;
  buttonCancel?: string = null;
  inputPlaceholder?: string = null;
  inputTxt?: string = null;
  inputErrors?: Array<string> = null;
  mask?: any = null;

  constructor(obj?: confirmDialogModel) {
    if (obj) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    }
  }
};

@Component({
  template: `
    <h1 md-dialog-title *ngIf="data.title">{{ data.title }}</h1>
    <div md-dialog-content>
      <h4 *ngIf="data.subTitle">{{ data.subTitle }}</h4>
      <p *ngIf="data.text">{{ data.text }}</p>
      <md-input-container *ngIf="data.inputPlaceholder && !data.mask">
        <input
          mdInput
          tabindex="1"
          placeholder="{{ data.inputPlaceholder }}"
          type="text"
          [(ngModel)]="data.inputTxt"
          class="form-control"
          maxlength="100">
      </md-input-container>
      <md-input-container *ngIf="data.inputPlaceholder && data.mask">
        <input
          mdInput
          [textMask]="{mask:data.mask, guide:false}"
          tabindex="1"
          placeholder="{{ data.inputPlaceholder }}"
          type="text"
          [(ngModel)]="data.inputTxt"
          class="form-control"
          maxlength="100">
      </md-input-container>
      <error-message [listErrors]="data.inputErrors"></error-message>
    </div>
    <div md-dialog-actions class="action-flex">
      <div class="space-flex"></div>
      <button md-raised-button color="default" *ngIf="data.buttonCancel" (click)="cancel()">
        {{ data.buttonCancel }}
      </button>
      <button md-raised-button color="warn" *ngIf="data.buttonOk" (click)="ok()">
        {{ data.buttonOk }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {

  // registra um listenner de autenticacao
  private authListenner: Subscription;

  constructor(private dialogRef: MdDialogRef<ConfirmDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: confirmDialogModel,
              private authService: AuthService) {
  }

  ngOnInit() {
    // registra o listenner
    this.authListenner = AuthService.wasAuthenticated.subscribe( au => {
      // fecha o dialog no logoff
      if (!au) this.dialogRef.close();
    } );
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.authListenner.unsubscribe();
  }

  ok(): void {
    this.dialogRef.close({
      choice: 'ok',
      data: this.data
    });
  }

  cancel(): void {
    this.dialogRef.close({
      choice: 'cancel',
      data: this.data
    });
  }
}
