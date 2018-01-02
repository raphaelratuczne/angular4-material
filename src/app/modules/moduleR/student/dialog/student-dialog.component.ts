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
import { Student } from '../student.model';
import { StudentService } from '../student.service';

@Component({
  templateUrl: 'student-dialog.component.html',
})
export class StudentDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

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

  constructor(@Inject(MD_DIALOG_DATA) public data: Student,
              private dialogRef: MdDialogRef<StudentDialogComponent>,
              private dateLocale: DateLocale,
              private studentService: StudentService,
              private http: Http,
              private stateService: StateService,
              private cityService: CityService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','student']);

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
        maxlength: this.txt.fields.email.errors.maxlength,
        email: this.txt.fields.email.errors.email,
      },
      'person.birthDate': {
      },
      'person.gender': {
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
          if (this.data.id !== null && this.data.person.address.city.state !== null) {
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
      person: this.formBuilder.group({
        id: this.data.person.id,
        cpf: [
          {value: this.data.person.cpf, disabled: (this.data.person.cpf !== null ? true : false)},
          [Validators.required, Validators.maxLength(14), validateCpf]],
        name: [
          {value: this.data.person.name, disabled: false},
          [Validators.required, Validators.maxLength(255)]],
        email: [
          {value: this.data.person.email || '', disabled: false},
          [Validators.maxLength(100), customEmailValidator]],
        birthDate: [
          {value: this.data.person.birthDate, disabled: false}],
        gender: [
          {value: this.data.person.gender, disabled: false}],
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
            {value: this.data.person.address.zipcode, disabled: false}],
          street: [
            {value: this.data.person.address.street, disabled: false}],
          number: [
            {value: this.data.person.address.number, disabled: false}],
          complement: [
            {value: this.data.person.address.complement, disabled: false}],
          cityArea: [
            {value: this.data.person.address.cityArea, disabled: false}],
          city: this.formBuilder.group({
            id: [
              {value: this.data.person.address.city.id, disabled: false}]
          })
        }),
        phoneNumber: [
          {value: this.data.person.phoneNumber, disabled: false},
          Validators.maxLength(14)],
        cellPhoneNumber: [
          {value: this.data.person.cellPhoneNumber, disabled: false},
          Validators.maxLength(15)],
      }),
      enrollments: this.formBuilder.array([])
    });

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    // pega os valores do endereco
    const zipcode =     this.form.get('person.address.zipcode').value,
          street =      this.form.get('person.address.street').value,
          _number =     this.form.get('person.address.number').value,
          complement =  this.form.get('person.address.complement').value,
          cityArea =    this.form.get('person.address.cityArea').value,
          city =        this.form.get('person.address.city.id').value;

    // funcao para verificar se nao esta vazio
    const isValid = value => value ? (String(value).replace(/\s/g,'') ? true : false) : false;
    // funcao para validar o tamanho do campo
    const maxLength = (value:string|number, length:number):boolean => String(value).length <= length;

    // verifica se preencheu um dos dados de endereco
    if ( isValid(zipcode) || isValid(street) || isValid(_number) || isValid(complement) || isValid(cityArea) || isValid(city) ) {
      // se preencheu um dos campos, torna-se obrigatorio preencher os demais
      // verifica manualmente o tamanho dos campos
      this.form.get('person.address.zipcode').setErrors( isValid(zipcode) ? (maxLength(zipcode, 9) ? null : {maxlength:true}) : {required:true} );
      this.form.get('person.address.street').setErrors( isValid(street) ? (maxLength(street, 200) ? null : {maxlength:true}) : {required:true} );
      this.form.get('person.address.number').setErrors( isValid(_number) ? (maxLength(_number, 20) ? null : {maxlength:true}) : {required:true} );
      this.form.get('person.address.complement').setErrors( isValid(complement) ? (maxLength(complement, 20) ? null : {maxlength:true}) : null );
      this.form.get('person.address.cityArea').setErrors( isValid(cityArea) ? (maxLength(cityArea, 100) ? null : {maxlength:true}) : {required:true} );
      this.form.get('person.address.city.id').setErrors( isValid(city) ? null : {required:true} );
    } else {
      this.form.get('person.address.zipcode').setErrors(null);
      this.form.get('person.address.street').setErrors(null);
      this.form.get('person.address.number').setErrors(null);
      this.form.get('person.address.complement').setErrors(null);
      this.form.get('person.address.cityArea').setErrors(null);
      this.form.get('person.address.city.id').setErrors(null);
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
      if ( this.form.get('person.address.zipcode').value )
        this.form.get('person.address.zipcode').setValue( this.form.get('person.address.zipcode').value.replace(/[^\d]+/g,'') );

      this._send(this.data.id, this.studentService, this.dialogRef);
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
                    // exibe mensagem de erro
                    this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
                    // fecha o dialog
                    this.dialogRef.close('error');
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
