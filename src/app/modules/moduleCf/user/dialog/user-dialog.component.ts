import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { objectToArray, validateCpf, CommonFormComponent } from 'app/shared';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: 'user-dialog.component.html',
})
export class UserDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de categorias
  public typesList: Object[];
  // mascara de cpf
  public cpfMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/];

  constructor(@Inject(MD_DIALOG_DATA) public data: User,
              private dialogRef: MdDialogRef<UserDialogComponent>,
              private userService: UserService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','user']);
    // recupera a lista de categorias
    this.typesList = objectToArray(this.data.typesList);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      cpf: [],
      firstName: [],
      lastName: [],
      email: [],
      active: [],
      userTypeId:[],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      cpf: {
        required: this.txt.fields.cpf.errors.required,
        maxlength: this.txt.fields.cpf.errors.maxlength,
        cpf: this.txt.fields.cpf.errors.cpf,
      },
      firstName: {
        required: this.txt.fields.firstName.errors.required,
        maxlength: this.txt.fields.firstName.errors.maxlength,
      },
      lastName: {
        required: this.txt.fields.lastName.errors.required,
        maxlength: this.txt.fields.lastName.errors.maxlength,
      },
      email: {
        required: this.txt.fields.email.errors.required,
        maxlength: this.txt.fields.email.errors.maxlength,
        email: this.txt.fields.email.errors.email,
      },
      active: {
      },
      userTypeId: {
        required: this.txt.fields.userTypeId.errors.required,
      },
    };
    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

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
      id: this.data.id,
      cpf: [
        {value: this.data.cpf, disabled: (this.data.cpf !== null ? true : false)},
        [Validators.required, Validators.maxLength(14), validateCpf]],
      firstName: [
        {value: this.data.firstName, disabled: false},
        [Validators.required, Validators.maxLength(30)]],
      lastName: [
        {value: this.data.lastName, disabled: false},
        [Validators.required, Validators.maxLength(80)]],
      email: [
        {value: this.data.email, disabled: false},
        [Validators.required, Validators.maxLength(100), Validators.email]],
      active: [
        {value: (this.data.active !== null ? this.data.active : true), disabled: false}],
      userTypeId: [
        {value: this.data.userTypeId, disabled: false},
        Validators.required],
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
    this.sent = true;
    this._onChangeValues();
    if ( this.form.valid ) {
      // remove caracteres especiais
      this.form.get('cpf').setValue( this.form.get('cpf').value.replace(/[^\d]+/g,'') );
      this._send(this.data.id, this.userService, this.dialogRef);
    }

  }

  /**
   * fecha o dialog
   * @param {MouseEvent} event
   */
  public cancel(event: MouseEvent): void {
    event.preventDefault();
    this.dialogRef.close('cancel');
  }

}
