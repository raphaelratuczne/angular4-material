import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';

@Component({
  selector: 'login-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss']
})
export class NewPassComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // token
  private token: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo  pagina
    super(injector, ['login','newPass']);
    // pega o token
    this.token = this.route.snapshot.params['token'];
  }

  ngOnInit() {
    if ( this.authService.isAuthenticated() ) {
      this.router.navigate(['/dashboard']);
    }

    // lista de erros de validacao
    this.formErrors = {
      password: [],
      rePass: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      password: {
        required: this.txt.fields.password.errors.required,
        maxlength: this.txt.fields.password.errors.maxlength,
      },
      rePass: {
        equalTo: this.txt.fields.rePass.errors.equalTo,
      },
    };

    // inicializa o formulario
    this.buildForm();
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.cancelListenners();
  }

  /**
   * cria o formulario
   */
  public buildForm(): void {
    let password = new FormControl('', [Validators.required, Validators.maxLength(100)]);
    let rePass = new FormControl('', CustomValidators.equalTo(password));

    this.form = this.formBuilder.group({
      password: password,
      rePass: rePass
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
      console.log( this.form.value );
      // flag de carregamento
      this.loading = true;
      // bloqueia o formulario
      this.form.disable();
      this.authService.newPass(this.form.get('password').value, this.token)
        .subscribe(
          res => {
            console.log(res);
            // flag de carregamento
            this.loading = false;
            // desbloqueia o formulario
            this.form.enable();
            // exibe mensagem
            this.snackBar.open(this.txt.messages.passSaved, 'Ok', {duration: 3000});
            if (res)
              this.router.navigate(['login']);
            else {
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

  cancel() {}

}
