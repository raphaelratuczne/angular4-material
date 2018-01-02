import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { texts, AuthService } from 'app/shared';
import { SmtpServerService } from './smtp-server.service';

@Component({
  selector: 'moduleCf-smtp-server-email-dialog',
  template: `
    <form class="form-email" [formGroup]="form" (ngSubmit)="send()">
      <h1 md-dialog-title>{{ txt.title }}</h1>
      <div md-dialog-content>
        <md-input-container>
          <input
            mdInput
            tabindex="1"
            placeholder="{{ txt.fields.email }}"
            type="text"
            formControlName="email"
            class="form-control"
            maxlength="100">
        </md-input-container>
        <error-message [listErrors]="formErrors.email"></error-message>
      </div>
      <!--<div md-dialog-actions style="display:block">-->
      <div md-dialog-actions class="action-flex">
        <div class="space-flex" *ngIf="!errorMsgSent"></div>
        <button md-raised-button color="primary" *ngIf="!errorMsgSent" [disabled]="loading" (click)="send()" style="margin-left:20px">
          {{ txt.buttons.send }}
        </button>
        <div class="alert alert-danger space-flex" *ngIf="errorMsgSent">
          {{ errorMsgSent }}
        </div>
      </div>
    </form>
    <!--<md-progress-bar class="progress-bar-dialog" *ngIf="loading" mode="indeterminate"></md-progress-bar>-->
  `
})
export class EmailDialogComponent implements OnInit, OnDestroy {

  // textos do layout
  public txt = texts.moduleCf.smtpServer.modal;
  // objeto de formulario
  public form: FormGroup;
  // referencia para escutar as alteracoes no formulario
  private formChanges: Subscription;
  // se enviou o formulario
  public sent: boolean = false;
  // se esta carregando/enviando
  public loading: boolean = false;
  // mensagem de erro de servico ao enviar
  public errorMsgSent: string;
  // registra um listenner de autenticacao
  private authListenner: Subscription;

  constructor(
    private dialogRef: MdDialogRef<EmailDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
    private smtpServerService: SmtpServerService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.authListenner = AuthService.wasAuthenticated.subscribe( au => {
      // fecha o dialog no logoff
      if (!au) this.dialogRef.close();
    } );
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.formChanges.unsubscribe();
    this.authListenner.unsubscribe();
  }

  /**
   * lista de erros de validacao
   */
  public formErrors = {
    email: []
  };
  /**
   * lista de mensagens de erros de validacao
   */
  public validationMessages = {
    email: {
      required: this.txt.fields.errors.required,
      email: this.txt.fields.errors.email,
    }
  };

  /**
   * cria o formulario
   */
  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: [
        {value: null, disabled: false},
        [Validators.required, Validators.email]]
    });

    // observa as mudancas
    this.formChanges = this.form.valueChanges.subscribe( data => this.onChangeValues() );
    // verifica as mudancas
    this.onChangeValues();

    // console.log(this.formulario);
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {
    if (!this.form) {
      return;
    }

    for (let field in this.formErrors) {
      // limpa as mensagens de erros anteriores
      this.formErrors[field] = [];
      let control = this.form.get(field);
      // verifica novos erros
      if (control && !control.valid && (control.touched || this.sent)) {
        // let msg = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field].push( this.validationMessages[field][key] );
        }
      }
    }
  }

  public send(): void {
    // flag de envio
    this.sent = true;
    // verifica erros
    this.onChangeValues();
    if ( this.form.valid ) {
      this.loading = true;
      this.form.disable();
      this.smtpServerService.sendEmail(this.form.get('email').value)
        .subscribe(
          res => {
            // console.log('resposta post:', res);
            // flag de carregamento
            this.loading = false;
            // libera o formulario
            this.form.enable();
            // exibe mensagem de sucesso
            this.snackBar.open(this.txt.messages.sent, 'Ok', {duration: 2000});
            // fecha a janela de dialog
            this.dialogRef.close({
              choice: 'ok',
              data: this.data
            });
          },
          error => {
            console.error(error);
            // exibe mensagem de erro
            this.errorMsgSent = this.txt.messages.error + error;
            // flag de carregamento
            this.loading = false;
            // libera o formulario
            this.form.enable();
            // esconde a mensagem de erros apos 5 seg
            setTimeout(() => this.errorMsgSent = null , 5000);
          }
        );
    }
  }

}
