import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Subscription } from 'rxjs/Rx';
import { MdSnackBar, MdDialog } from '@angular/material';

import { CommonFormComponent } from 'app/shared';
import { SmtpServer } from './smtp-server.model';
import { SmtpServerService } from './smtp-server.service';
import { EmailDialogComponent } from './email-dialog.component';

@Component({
  selector: 'configuratio-smtp-server',
  templateUrl: './smtp-server.component.html',
  styleUrls: ['./smtp-server.component.scss']
})
export class SmtpServerComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // mascara de codigo - somente numeros
  public portMask = [/\d/,/\d/,/\d/,/\d/,/\d/];
  // mascara de codigo - somente numeros
  public timeoutMask = [/\d/,/\d/,/\d/];

  constructor(private smtpServerService: SmtpServerService,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','smtpServer']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      description: [],
      server: [],
      port: [],
      username: [],
      password: [],
      enableSSL: [],
      timeout: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      description: {
        required: this.txt.fields.description.errors.required,
        maxlength: this.txt.fields.description.errors.maxlength,
      },
      server: {
        required: this.txt.fields.server.errors.required,
        maxlength: this.txt.fields.server.errors.maxlength,
      },
      port: {
        required: this.txt.fields.port.errors.required,
        maxlength: this.txt.fields.port.errors.maxlength,
        number: this.txt.fields.port.errors.number,
      },
      username: {
        required: this.txt.fields.username.errors.required,
        maxlength: this.txt.fields.username.errors.maxlength,
      },
      password: {
        required: this.txt.fields.password.errors.required,
        maxlength: this.txt.fields.password.errors.maxlength,
      },
      enableSSL: {
        required: '',
      },
      timeout: {
        required: this.txt.fields.timeout.errors.required,
        maxlength: this.txt.fields.timeout.errors.maxlength,
        range: this.txt.fields.timeout.errors.range,
        number: this.txt.fields.timeout.errors.number,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(2);
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.cancelListenners();
  }


  /**
   * cria o formulario
   */
  public buildForm(): void {
    this.form = this.formBuilder.group({
      description: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(100)]],
      server: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(100)]],
      port: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(5), CustomValidators.number]],
      username: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(50)]],
      password: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(50)]],
      enableSSL: [
        {value: null, disabled: true},
        Validators.required],
      timeout: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(3), CustomValidators.range([1, 120]), CustomValidators.number]],
    });

    // observa as mudancas
    this._afterBuildForm();

    // carrega os dados
    this.loadData();

  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  /**
   * envia email para testar servidor
   * @param  {MouseEvent} event evento de mouse
   * @param  {string}     email email digitado
   */
  public sendEmail(event: MouseEvent, email?:string): void {
    // se clicou com o mouse
    if (event) {
      // evita o envio do formulario
      event.preventDefault();
    }
    // erro de email invalido
    let err = email ? [this.txt.modal.fields.errors.email] : null;
    // abre a janela de dialog
    let dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '500px',
      data: 'teste'
    });
  }

  /**
   * solicita os dados
   */
  private loadData(): void {

    this._loadData(this.smtpServerService);

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(null, this.smtpServerService);

  }

  cancel() {}

}
