import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Http } from '@angular/http';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { DateLocale } from 'md2';

import { validateCpf,
         customEmailValidator,
         CommonFormComponent,
         State,
         StateService,
         City,
         CityService,
         removeAccents } from 'app/shared';
import { Instructor } from '../instructor.model';
import { InstructorService } from '../instructor.service';

@Component({
  templateUrl: 'instructor-dialog.component.html',
})
export class InstructorDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de estados
  public listState: State[] = null;
  // lista de cidades
  public listCities: City[] = [];
  // mascara de cpf
  public cpfMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/];
  // mascara de cep
  public cepMask = [/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/];
  // mascara fone fixo
  public phoneMask = ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];
  // mascara fone celular
  public cellPhoneMask = ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];

  constructor(@Inject(MD_DIALOG_DATA) public data: Instructor,
              private dialogRef: MdDialogRef<InstructorDialogComponent>,
              private dateLocale: DateLocale,
              private instructorService: InstructorService,
              private http: Http,
              private stateService: StateService,
              private cityService: CityService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','instructor']);

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
      active: [],
      authPraticalLesson: [],
      authSimulatorLesson: [],
      authTheoricalLesson: [],
      'person.cpf': [],
      'person.name': [],
      'person.email': [],
      'person.birthDate': [],
      'person.gender': [],
      'person.rg': [],
      'person.rgExpeditionAgency':[],
      'person.rgState.id':[],
      'person.rgExpeditionDate':[],
      'person.address.zipcode':[],
      'person.address.street':[],
      'person.address.number':[],
      'person.address.complement':[],
      'person.address.cityArea':[],
      'person.address.city.id':[],
      'person.phoneNumber':[],
      'person.cellPhoneNumber':[],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      active: {
      },
      authPraticalLesson: {
      },
      authSimulatorLesson: {
      },
      authTheoricalLesson: {
        required: this.txt.fields.authTheoricalLesson.errors.required,
      },
      'person.cpf': {
        required: this.txt.fields.cpf.errors.required,
        maxlength: this.txt.fields.cpf.errors.maxlength,
        cpf: this.txt.fields.cpf.errors.cpf,
      },
      'person.name': {
        required: this.txt.fields.name.errors.required,
        maxlength: this.txt.fields.name.errors.maxlength,
      },
      'person.email': {
        required: this.txt.fields.email.errors.required,
        maxlength: this.txt.fields.email.errors.maxlength,
        email: this.txt.fields.email.errors.email,
      },
      'person.birthDate': {
        required: this.txt.fields.birthDate.errors.required,
      },
      'person.gender': {
        required: this.txt.fields.gender.errors.required,
      },
      'person.rg': {
        maxlength: this.txt.fields.rg.errors.maxlength,
      },
      'person.rgExpeditionAgency': {
        maxlength: this.txt.fields.rgExpeditionAgency.errors.maxlength,
      },
      'person.rgState.id': {
      },
      'person.rgExpeditionDate': {
      },
      'person.address.zipcode': {
        required: this.txt.fields.zipcode.errors.required,
        maxlength: this.txt.fields.zipcode.errors.maxlength,
      },
      'person.address.street': {
        required: this.txt.fields.street.errors.required,
        maxlength: this.txt.fields.street.errors.maxlength,
      },
      'person.address.number': {
        required: this.txt.fields.number.errors.required,
        maxlength: this.txt.fields.number.errors.maxlength,
      },
      'person.address.complement': {
        maxlength: this.txt.fields.complement.errors.maxlength,
      },
      'person.address.cityArea': {
        required: this.txt.fields.cityArea.errors.required,
        maxlength: this.txt.fields.cityArea.errors.maxlength,
      },
      'person.address.city.id': {
        required: this.txt.fields.city.errors.required,
      },
      'person.phoneNumber': {
        maxlength: this.txt.fields.phoneNumber.errors.maxlength,
      },
      'person.cellPhoneNumber': {
        maxlength: this.txt.fields.cellPhoneNumber.errors.maxlength,
      },
    };
    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de estados
    this.stateService.getStates()
      .subscribe(
        resState => {
          this.listState = resState;
          // se já passou os dados, carrega a lista de cidades
          if (this.data.id !== null) {
            this.cityService.getCities(this.data.person.address.city.state.id)
              .subscribe(
                resCity => {
                  this.listCities = resCity;
                },
                error => {
                  // exibe mensagem de erro
                  this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
                  // fecha o dialog
                  this.dialogRef.close('error');
                }
              );
          }
        },
        error => {
          // exibe mensagem de erro
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          // fecha o dialog
          this.dialogRef.close('error');
        }
      );

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
      active: [
        {value: (this.data.active !== null ? this.data.active : true), disabled: false}],
      authPraticalLesson: [
        {value: this.data.authPraticalLesson, disabled: false}],
      authSimulatorLesson: [
        {value: this.data.authSimulatorLesson, disabled: false}],
      authTheoricalLesson: [
        {value: this.data.authTheoricalLesson, disabled: false}],
      person: this.formBuilder.group({
        cpf: [
          {value: this.data.person.cpf, disabled: (this.data.person.cpf !== null ? true : false)},
          [Validators.required, Validators.maxLength(14), validateCpf]],
        name: [
          {value: this.data.person.name, disabled: false},
          [Validators.required, Validators.maxLength(255)]],
        email: [
          {value: this.data.person.email || '', disabled: false},
          [Validators.required, Validators.maxLength(100), customEmailValidator]],
        birthDate: [
          {value: this.data.person.birthDate, disabled: false},
          Validators.required],
        gender: [
          {value: this.data.person.gender, disabled: false},
          Validators.required],
        rg: [
          {value: this.data.person.rg, disabled: false},
          Validators.maxLength(20)],
        rgExpeditionAgency: [
          {value: this.data.person.rgExpeditionAgency, disabled: false},
          Validators.maxLength(20)],
        rgState: this.formBuilder.group({
          id: [
            {value: this.data.person.rgState.id, disabled: false}]
        }),
        rgExpeditionDate: [
          {value: this.data.person.rgExpeditionDate, disabled: false}],
        address: this.formBuilder.group({
          zipcode: [
            {value: this.data.person.address.zipcode, disabled: false},
            [Validators.required, Validators.maxLength(9)]],
          street: [
            {value: this.data.person.address.street, disabled: false},
            [Validators.required, Validators.maxLength(200)]],
          number: [
            {value: this.data.person.address.number, disabled: false},
            [Validators.required, Validators.maxLength(20)]],
          complement: [
            {value: this.data.person.address.complement, disabled: false},
            Validators.maxLength(50)],
          cityArea: [
            {value: this.data.person.address.cityArea, disabled: false},
            [Validators.required, Validators.maxLength(100)]],
          city: this.formBuilder.group({
            id: [
              {value: this.data.person.address.city.id, disabled: false},
              Validators.required]
          })
        }),
        phoneNumber: [
          {value: this.data.person.phoneNumber, disabled: false},
          Validators.maxLength(14)],
        cellPhoneNumber: [
          {value: this.data.person.cellPhoneNumber, disabled: false},
          Validators.maxLength(15)],
      }),
    });

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    // verifica se ao menos uma autorizacao foi marcada
    if ( this.form.get('authPraticalLesson').value || this.form.get('authSimulatorLesson').value || this.form.get('authTheoricalLesson').value ) {
      this.form.get('authTheoricalLesson').setErrors(null);
    } else {
      this.form.get('authTheoricalLesson').setErrors({required:true});
    }

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
      this.form.get('person.cpf').setValue( this.form.get('person.cpf').value.replace(/[^\d]+/g,'') );
      // if ( this.form.get('person.address.zipcode').value )
      this.form.get('person.address.zipcode').setValue( this.form.get('person.address.zipcode').value.replace(/[^\d]+/g,'') );

      this._send(this.data.id, this.instructorService, this.dialogRef);
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


  public searchCEP():void {
    // pega o cep
    let cep = this.form.get('person.address.zipcode').value;
    // console.log(cep);
    // verifica se o campo foi preenchido
    if (cep != null && cep != '') {
      // somente digitos
      cep = cep.replace(/[^\d]+/g,'');
      // expressão para validar o cep
      let validateCep = /^[0-9]{8}/;
      // valida o cep
      if ( validateCep.test(cep) ) {
        // moduleCsa os dados pelo cep
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .map( resp => resp.json() )
          .subscribe( resCep => {
            // se o cep é valido
            if ( typeof resCep.erro == 'undefined' ) {
              // popula os campos
              this.form.get('person.address.street').setValue(resCep.logradouro);
              this.form.get('person.address.cityArea').setValue(resCep.bairro);
              // pega o id o estado
              const idState = this.listState.find( state => state.uf == resCep.uf ).id;
              // traz a lista de cidades pelo estado
              this.cityService.getCities(idState)
                .subscribe(
                  resCity => {
                    // popula a lista de cidades
                    this.listCities = resCity;
                    // pega o id da cidade pelo nome
                    const idCity = this.listCities.find( city => removeAccents(city.name).toLowerCase() == removeAccents(resCep.localidade).toLowerCase() ).id;
                    // seta o valor da cidade
                    this.form.get('person.address.city.id').setValue(idCity);
                  },
                  error => {
                    console.error(error);
                    // exibe mensagem de erro
                    this.errorMsgSent = this.txt.messages.errorCep;
                    // esconde a mensagem de erros apos 5 seg
                    setTimeout(() => this.errorMsgSent = null , 5000);
                    // // exibe mensagem de erro
                    // this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
                    // // fecha o dialog
                    // this.dialogRef.close('error');
                  }
                );
              } else {
                // cep invalido
                // exibe mensagem de erro
                this.errorMsgSent = this.txt.messages.invalidCep;
                // esconde a mensagem de erros apos 5 seg
                setTimeout(() => this.errorMsgSent = null , 3000);
                // anula o valor da cidade
                this.form.get('person.address.city.id').setValue(null);
                // limpa lista de cidades
                this.listCities = [];
              }
          } );
      }
    }

    this.onChangeValues();
  }
}
