import { Component, OnInit, OnDestroy, DoCheck, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { validateCpf,
         fValidateCpf,
         ConfirmDialogComponent,
         confirmDialogModel,
         CommonFormComponent } from 'app/shared';

import * as packageObject from '../../../../../package.json';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends CommonFormComponent implements OnInit, OnDestroy, DoCheck {

  // versao
  public appVersion;
  // mascara de cpf
  public cpfMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/];
  // lembrar usuario
  public rememberMe: boolean = true;
  // se esta em um sub tela
  public showLogin = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo  pagina
    super(injector, ['login','login']);

    this.appVersion = packageObject.version;
  }

  ngOnInit() {
    // carrega empresas e dados do usuario
    this.posLogin();

    // lista de erros de validacao
    this.formErrors = {
      cpf: [],
      password: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      cpf: {
        required: this.txt.fields.cpf.errors.required,
        cpf: this.txt.fields.cpf.errors.cpf,
      },
      password: {
        required: this.txt.fields.password.errors.required,
        maxlength: this.txt.fields.password.errors.maxlength,
      },
    };

    // inicializa o formulario
    this.buildForm();
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.cancelListenners();
  }

  ngDoCheck() {
    // verifica se deve exibir a tela de login
    this.showLogin = (this.router.url.indexOf('new-pass') != -1) || this.router.url.indexOf('view') != -1 ? false : true;
  }

  /**
   * cria o formulario
   */
  public buildForm(): void {
    this.form = this.formBuilder.group({
      cpf: [
        {value: '30100985297', disabled: false},
        // {value: '937.526.126-30', disabled: false},
        [Validators.required, validateCpf] ],
      password: [
        {value: 'MobilisAdmin2017', disabled: false},
        // {value: '123', disabled: false},
        [Validators.required, Validators.maxLength(100)]],
    });

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {
    // falg de envio
    this.sent = true;
    // verifica erros
    this.onChangeValues();
    if ( this.form.valid ) {
      // console.log( this.form.value );
      // flag de carregamento
      this.loading = true;
      // bloqueia o formulario
      this.form.disable();
      this.authService.login(this.form.get('cpf').value.replace(/[^\d]+/g,''), this.form.get('password').value, this.rememberMe)
        .subscribe(
          resLogin => {
            // console.log('login-login ->', resLogin);
            // flag de carregamento
            this.loading = false;
            // desbloqueia o formulario
            this.form.enable();
            if ( resLogin ) {
              // carrega empresas e dados do usuario
              this.posLogin();

            } else {
              // exibe mensagem de erro
              this.errorMsgSent = this.txt.messages.error;
              // esconde a mensagem de erros apos 5 seg
              setTimeout(() => this.errorMsgSent = null , 5000);
            }
          },
          error => {
            console.error(error);
            // exibe mensagem de erro
            this.errorMsgSent = error;
            // esconde a mensagem de erros apos 5 seg
            setTimeout(() => this.errorMsgSent = null , 5000);
            // flag de carregamento
            this.loading = false;
            // desbloqueia o formulario
            this.form.enable();
          }
        );
    }
  }

  /**
   * carrega dados das empresas e do usuario apos fazer o login
   */
  private posLogin(): void {
    // verifica se ja esta logado
    if ( this.authService.isAuthenticated() ) {
      // flag de carregamento
      this.loading = true;
      // pega lista de empresas do usuario
      this.authService.getCompanies()
        .subscribe(
          resCompanies => {
            // console.log('login-getCompanies ->', resCompanies);
            // console.log(resCompanies);
            if ( resCompanies.length < 1 ) {
              this.loading = false;
              // ocorreu algum erro
              // console.error('nenhuma empresa relaciona a esse user');
              // exibe mensagem de erro
              this.errorMsgSent = this.txt.messages.noCompanyUser;
              // esconde a mensagem de erros apos 5 seg
              setTimeout(() => this.errorMsgSent = null , 5000);
              this.authService.logoff();

            // se tiver apenas 1 empresa associada ao usuario, vai direto para o dashboard
            } else if ( resCompanies.length == 1 ) {
              // pega os dados da empresa
              this.authService.getAuthUser()
                .subscribe(
                  res => {
                    // console.log('login-getAuthUser ->', res);
                    // se tentou acessar uma url especifica antes de logar
                    if ( this.authService.redirectUrl )
                      this.router.navigate([this.authService.redirectUrl]);
                    else
                      this.router.navigate(['/dashboard']);
                } );

            } else {
              // se tiver mais de 1 empresa associada ao usuario, vai para a tela da visao
              this.router.navigate(['/login/view']);
            }

          } );
    }
  }

  public showFormResetPass(data?:confirmDialogModel): void {
    // dados do modal
    data = data ? new confirmDialogModel(data) : new confirmDialogModel({
        title: this.txt.modal.title,
        subTitle: this.txt.modal.subTitle,
        text: this.txt.modal.messages,
        inputPlaceholder: this.txt.fields.cpf.label,
        buttonOk: this.txt.modal.buttons.ok,
        buttonCancel: this.txt.modal.buttons.cancel,
        mask: this.cpfMask
      });
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: data
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      if (result && result.choice == 'ok') {
        // valida o cpf digitado
        if ( result.data.inputTxt == null || !fValidateCpf(result.data.inputTxt) ) {
          // console.log('cpf invalido');
          result.data.inputErrors = [this.txt.fields.cpf.errors.cpf];
          setTimeout(()=>this.showFormResetPass(result.data),600);

        } else {
          // flag de carregamento
          this.loading = true;
          // console.log('cpf valido');
          this.authService.resetPass( result.data.inputTxt.replace(/[^\d]+/g,'') )
            .subscribe(
              res => {
                // flag de carregamento
                this.loading = false;
                if (res) // exibe mensagem de sucesso
                  this.snackBar.open(this.txt.messages.emailPass, 'Ok', {duration: 3000});
              },
              error => {
                console.error(error);
                // flag de carregamento
                this.loading = false;
                // exibe mensagem de erro
                this.errorMsgSent = this.txt.messages.error + ' - ' + error;
                // esconde a mensagem de erros apos 5 seg
                setTimeout(() => this.errorMsgSent = null , 5000);
              }
            );
        }
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });
  }

  cancel() {}

}
