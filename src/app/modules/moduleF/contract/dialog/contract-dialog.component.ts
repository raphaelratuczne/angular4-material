import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA, MdSelect } from '@angular/material';
import { DateLocale } from 'md2';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { CommonFormComponent } from 'app/shared';
import { Contract } from '../contract.model';
import { ContractService } from '../contract.service';
import { User, UserService } from '../../../moduleCf/user';
import { DrivingSchool, DrivingSchoolService } from '../../../moduleR/driving-school';

@Component({
  templateUrl: 'contract-dialog.component.html',
})
export class ContractDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de usuarios
  public usersList: User[] = null;
  // lista de CFCs
  public cfcList: DrivingSchool[] = null;
  // mascara de numeros
  public daysMask = [/\d/,/\d/,/\d/,/\d/];
  // mascara de moeda
  public numberMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    integerLimit: 11,
    requireDecimal: true
  });

  constructor(@Inject(MD_DIALOG_DATA) public data:Contract,
              private dialogRef: MdDialogRef<ContractDialogComponent>,
              private dateLocale: DateLocale,
              private contractService: ContractService,
              private drivingSchoolService: DrivingSchoolService,
              private userService: UserService,
              private injector:Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','contract']);

    this.dateLocale.months = [
      { 'full': 'Janeiro', 'short': 'Jan' },
      { 'full': 'Fevereiro', 'short': 'Fev', },
      { 'full': 'Março', 'short': 'Mar' },
      { 'full': 'Abril', 'short': 'Abr' },
      { 'full': 'Maio', 'short': 'Mai' },
      { 'full': 'Junho', 'short': 'Jun' },
      { 'full': 'Julho', 'short': 'Jul' },
      { 'full': 'Agosto', 'short': 'Ago' },
      { 'full': 'Setembro', 'short': 'Set' },
      { 'full': 'Outubro', 'short': 'Out' },
      { 'full': 'Novembro', 'short': 'Nov' },
      { 'full': 'Dezembro', 'short': 'Dez' }
    ];
    this.dateLocale.days = [
        { full: 'Domingo', short: 'Dom', xshort: 'D' },
        { full: 'Segunda', short: 'Seg', xshort: 'S' },
        { full: 'Terça', short: 'Ter', xshort: 'T' },
        { full: 'Quarta', short: 'Qua', xshort: 'Q' },
        { full: 'Quinta', short: 'Qui', xshort: 'Q' },
        { full: 'Sexta', short: 'Sex', xshort: 'S' },
        { full: 'Sábado', short: 'Sab', xshort: 'S' },
    ];
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      'drivingSchool.id': [],
      startDate: [],
      endDate: [],
      lessonPrice: [],
      advanceDaysToAlert: [],
      usersToAlert:  []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      'drivingSchool.id': {
        required: this.txt.fields.drivingSchool.errors.required,
      },
      startDate: {
        required: this.txt.fields.startDate.errors.required,
      },
      endDate: {
        required: this.txt.fields.endDate.errors.required,
        bigger: this.txt.fields.endDate.errors.bigger,
      },
      lessonPrice: {
        required: this.txt.fields.lessonPrice.errors.required,
        maxlength: this.txt.fields.lessonPrice.errors.maxlength,
      },
      advanceDaysToAlert: {
        required: this.txt.fields.advanceDaysToAlert.errors.required,
        maxlength: this.txt.fields.advanceDaysToAlert.errors.maxlength,
        number: this.txt.fields.advanceDaysToAlert.errors.number,
      },
      usersToAlert: {
        required: this.txt.fields.usersToAlert.errors.required,
      },
    };
    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de CFCs
    this.drivingSchoolService.loadData()
      .subscribe( resCfcs => {
        this.cfcList = resCfcs;
        console.log('lista de cfcs ->', this.cfcList);

        // carrega lista de usuarios
        this.userService.loadData()
          .subscribe(
            resUsers => {
              this.usersList = resUsers;
              // console.log('lista de usuarios ->', this.usersList);

              if ( this.data.id != null ) {
                // se vai alterar um contrato, limebra apenas os campos de data
                // e usuarios
                this.form.get('advanceDaysToAlert').enable();
                this.form.get('usersToAlert').enable();
              } else {
                // se nao esta editando, libera todo o form
                this.form.enable();
              }
            }
          );
      } );

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
      startDate: [
        {value: this.data.startDate, disabled: true},
        Validators.required],
      endDate: [
        {value: this.data.endDate, disabled: true},
        Validators.required],
      lessonPrice: [
        {value: this.data.lessonPrice, disabled: true},
        [Validators.required, Validators.maxLength(17)]],
      advanceDaysToAlert: [
        {value: this.data.advanceDaysToAlert, disabled: true},
        [Validators.maxLength(6), CustomValidators.number]
      ],
      drivingSchool: this.formBuilder.group({
        id: [
          {value: this.data.drivingSchool.id, disabled: true},
          Validators.required]
      }),
      usersToAlert: this.formBuilder.array([]),
      selectedUser: null // esse campo deve ser removido
    });

    // se possui users
    if ( this.data.usersToAlert ) {
      // cria elemento de FormGroup
      const usersToAlertFG = this.data.usersToAlert.map( user => this.formBuilder.group({
        id: user.id,
        name: user.name
      }) );
      // cria o FormArray
      const usersToAlerArray = this.formBuilder.array(usersToAlertFG);

      // adiciona ao form
      this.form.setControl('usersToAlert', usersToAlerArray);
    }

    // observa as mudancas
    this._afterBuildForm();
  }


  /**
   * get de usersToAlert
   * @return {FormArray}
   */
  public get usersToAlert(): FormArray {
    return this.form.get('usersToAlert') as FormArray;
  }

  /**
   * ao selecionar o cfc, adiciona ao campo
   * @param {number} id id do cfc
   */
  public onSelectValue(evt): void {
    if ( this.form.get('usersToAlert').value.findIndex( el => el.id == evt.value ) == -1 ) {
      // encontra o item
      const u = this.usersList.find( el => el.id == evt.value );
      // cria elemento de FormGroup
      const usersToAlertFG = this.formBuilder.group({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`
      });
      // adiciona ao form
      (this.form.get('usersToAlert') as FormArray).push(usersToAlertFG);
    }
    setTimeout( () => {
      this.form.get('selectedUser').setValue(null);
    }, 600 );
  }

  /**
   * remove um item da lista de users
   * @param {number} id id do user
   */
  public removeSelectedUser(id:number): void {
    // indice
    const i = this.form.get('usersToAlert').value.findIndex( el => el.id == id );
    // remove o item
    (this.form.get('usersToAlert') as FormArray).removeAt(i);
  }

  /**
   * adiciona zeros no final do campo de dinheiro
   */
  public changeSufix(): void {

    // verifica se tem os zeros no final do valor
    let lessonPrice = this.form.get('lessonPrice').value;

    if ( lessonPrice ) {
      if ( lessonPrice.substr(-1) == ',' )
        lessonPrice += '00';
      else if ( lessonPrice.substr(-2,1) == ',' )
        lessonPrice += '0';
      else if ( lessonPrice.substr(-3,1) != ',' )
        lessonPrice += ',00';

      // se o campo passou do limite
      if ( lessonPrice.length > 17 ) {
        // remove primeiro numero
        lessonPrice = lessonPrice.replace(/^(R\$\s)(\d\.)(.*)$/, '$1$3');
      }

      this.form.get('lessonPrice').setValue( lessonPrice );
    }

    this.onChangeValues();

  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    if ( this.sent ) {
      // verifica se a data de termino é maior que a data de inicio
      if ( this.form.get('endDate').value != null && this.form.get('startDate').value != null ) {
        const sD = (this.form.get('startDate').value as Date).getTime();
        const eD = (this.form.get('endDate').value as Date).getTime();
        if ( eD <= sD )
          this.form.get('endDate').setErrors({bigger:true});
      }

      // se setou os dias de alerta por email, deve selecionar
      // pelo menos um usuario
      const days = this.form.get('advanceDaysToAlert').value;
      const users = this.form.get('usersToAlert').value;
      // se setou os dias
      if ( days && days > 0 ) {
        if ( users.length < 1 ) {
          // seta o erro
          this.form.get('usersToAlert').setErrors({required:true});
        }
      } else {
        this.form.get('usersToAlert').setErrors(null);
      }

      // se setou algum usuario, deve setar os dias
      if ( users.length > 0 ) {
        if ( !days || days < 1 ) {
          // seta o erro
          this.form.get('advanceDaysToAlert').setErrors({required:true});
        }
      } else {
        this.form.get('advanceDaysToAlert').setErrors(null);
      }
    }

    this._onChangeValues();

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    // falg de envio
    this.sent = true;
    this.onChangeValues();
    if ( this.form.valid ) {

      this._send(this.data.id, this.contractService, this.dialogRef);

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
