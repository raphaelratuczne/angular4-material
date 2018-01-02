import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { validateCnpj,
         fValidateCnpj,
         State,
         StateService,
         City,
         CityService,
         CommonFormComponent,
         removeAccents } from 'app/shared';
import { SharedUnit } from '../shared-unit.model';
import { SharedUnitService } from '../shared-unit.service';
import { DrivingSchool } from '../../driving-school/driving-school.model';
import { DrivingSchoolService } from '../../driving-school/driving-school.service';

@Component({
  templateUrl: 'shared-unit-dialog.component.html',
})
export class SharedUnitDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // mensagem de cnpj ja cadastrado
  public cnpjMsg: string;
  // lista de CFCs
  public cfcList: DrivingSchool[] = null;
  // lista de estados
  public listState: State[] = null;
  // lista de cidades
  public listCities: City[] = [];
  // mascara de cnpj
  public cnpjMask = [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/];
  // mascara de telefone
  public phoneMask = ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];
  // mascara de cep
  public cepMask = [/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/];
  // valor boleano para o campo
  public scheduleAccessReadOnlyValue: boolean = true;

  constructor(@Inject(MD_DIALOG_DATA) public data: SharedUnit,
              private dialogRef: MdDialogRef<SharedUnitDialogComponent>,
              private sharedUnitService: SharedUnitService,
              private drivingSchoolService: DrivingSchoolService,
              private http: Http,
              private stateService: StateService,
              private cityService: CityService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','sharedUnit']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      // scheduleAccessEnabled: [],
      // scheduleAccessReadOnly: [],
      'company.cnpj': [],
      'company.name': [],
      'company.tradingName': [],
      'company.stateModuleR': [],
      'company.email': [],
      'company.phoneNumber': [],
      'company.address.zipcode': [],
      'company.address.street': [],
      'company.address.number': [],
      'company.address.complement': [],
      'company.address.cityArea': [],
      'company.address.city.id': [],
      // drivingSchools: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      'company.cnpj': {
        required: this.txt.fields.cnpj.errors.required,
        maxlength: this.txt.fields.cnpj.errors.maxlength,
        cnpj: this.txt.fields.cnpj.errors.cnpj,
      },
      'company.name': {
        required: this.txt.fields.name.errors.required,
        maxlength: this.txt.fields.name.errors.maxlength,
      },
      'company.tradingName': {
        required: this.txt.fields.tradingName.errors.required,
        maxlength: this.txt.fields.tradingName.errors.maxlength,
      },
      'company.stateModuleR': {
        required: this.txt.fields.stateModuleR.errors.required,
        maxlength: this.txt.fields.stateModuleR.errors.maxlength,
      },
      'company.email': {
        required: this.txt.fields.email.errors.required,
        maxlength: this.txt.fields.email.errors.maxlength,
        email: this.txt.fields.email.errors.email,
      },
      'company.phoneNumber': {
        required: this.txt.fields.phoneNumber.errors.required,
        maxlength: this.txt.fields.phoneNumber.errors.maxlength,
      },
      'company.address.zipcode': {
        required: this.txt.fields.zipcode.errors.required,
        maxlength: this.txt.fields.zipcode.errors.maxlength,
      },
      'company.address.street': {
        required: this.txt.fields.street.errors.required,
        maxlength: this.txt.fields.street.errors.maxlength,
      },
      'company.address.number': {
        required: this.txt.fields.number.errors.required,
        maxlength: this.txt.fields.number.errors.maxlength,
      },
      'company.address.complement': {
        maxlength: this.txt.fields.complement.errors.maxlength,
      },
      'company.address.cityArea': {
        required: this.txt.fields.cityArea.errors.required,
        maxlength: this.txt.fields.cityArea.errors.maxlength,
      },
      'company.address.city.id': {
        required: this.txt.fields.city.errors.required,
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
        // console.log('lista de cfcs ->', this.cfcList);
      } );

    // carrega lista de estados
    this.stateService.getStates()
      .subscribe(
        resState => {
          this.listState = resState;
          // se já passou os dados, carrega a lista de cidades
          if (this.data.id !== null) {
            this.cityService.getCities(this.data.company.address.city.state.id)
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
      scheduleAccessEnabled: this.data.scheduleAccessEnabled || false,
      scheduleAccessReadOnly: this.data.scheduleAccessReadOnly != null ? this.data.scheduleAccessReadOnly : true,
      company: this.formBuilder.group({
        id: this.data.company.id,
        cnpj: [
          {value: this.data.company.cnpj, disabled: (this.data.company.cnpj ? true : false)},
          [Validators.required, Validators.maxLength(18), validateCnpj]],
        name: [
          {value: this.data.company.name, disabled: false},
          [Validators.required, Validators.maxLength(50)]],
        tradingName: [
          {value: this.data.company.tradingName, disabled: false},
          [Validators.required, Validators.maxLength(100)]],
        stateModuleR: [
          {value: this.data.company.stateModuleR, disabled: false},
          [Validators.required, Validators.maxLength(30)]],
        email: [
          {value: this.data.company.email, disabled: false},
          [Validators.required, Validators.maxLength(100), Validators.email]],
        phoneNumber: [
          {value: this.data.company.phoneNumber, disabled: false},
          [Validators.required, Validators.maxLength(15)]],
        address: this.formBuilder.group({
          id: this.data.company.address.id,
          zipcode: [
            {value: this.data.company.address.zipcode, disabled: false},
            [Validators.required, Validators.maxLength(9)]],
          street: [
            {value: this.data.company.address.street, disabled: false},
            [Validators.required, Validators.maxLength(200)]],
          number: [
            {value: this.data.company.address.number, disabled: false},
            [Validators.required, Validators.maxLength(20)]],
          complement: [
            {value: this.data.company.address.complement, disabled: false},
            Validators.maxLength(50)],
          cityArea: [
            {value: this.data.company.address.cityArea, disabled: false},
            [Validators.required, Validators.maxLength(100)]],
          city: this.formBuilder.group({
            id: [
              {value: this.data.company.address.city.id, disabled: false},
              Validators.required],
          })
        })
      }),
      relatedDrivingSchools: this.formBuilder.array([])
    });

    // se possui cfcs
    if ( this.data.relatedDrivingSchools ) {
      // cria elemento de FormGroup
      const relatedDrivingSchoolsFG = this.data.relatedDrivingSchools.map( ds => this.formBuilder.group({
        id: ds.id,
        company: this.formBuilder.group({
          id: ds.company.id,
          name: ds.company.name
        })
      }) );
      // cria o FormArray
      const relatedDrivingSchoolsArray = this.formBuilder.array(relatedDrivingSchoolsFG);

      // adiciona ao form
      this.form.setControl('relatedDrivingSchools', relatedDrivingSchoolsArray);
    }

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * faz uma busca pelo cnpj para verificar se ja esta cadastrados
   */
  public changeCnpj(): void {

    let cnpj = this.form.get('company.cnpj').value;

    if ( cnpj && cnpj.length == 18 && fValidateCnpj(cnpj) ) {

      // limpa cnpj
      cnpj = cnpj.replace(/[^\d]+/g,'');

      // procura pelo cnpj
      const cfc = this.cfcList.find( item => item.company.cnpj == cnpj );

      // se encontrou, preenche o form
      if ( cfc ) {
        this.form.get('company').patchValue( cfc.company );
        this.searchCEP();
        this.cnpjMsg = this.txt.messages.cnpjUsed;

      } else {
        this.cnpjMsg = null;
        // se nao encontrou na lista de cfcs, procura na lista de centros compartilhados
        this.sharedUnitService.loadData()
          .subscribe(
            resSU => {
              const su = resSU.find( item => item.company.cnpj == cnpj );
              // se encontrou, preenche o form
              if ( su ) {
                this.form.get('company').patchValue( su.company );
                this.searchCEP();
                this.cnpjMsg = this.txt.messages.cnpjUsed;
              } else {
                this.cnpjMsg = null;
              }
            }
          );
      }
    }
  }

  /**
   * get de relatedDrivingSchools
   * @return {FormArray}
   */
  public get relatedDrivingSchools(): FormArray {
    return this.form.get('relatedDrivingSchools') as FormArray;
  }

  /**
   * ao selecionar o cfc, adiciona ao campo
   * @param {number} id id do cfc
   */
  public onSelectValue(select): void {
    if ( this.form.get('relatedDrivingSchools').value.findIndex( el => el.id == select.value ) == -1 ) {
      // encontra o item
      const ds = this.cfcList.find( el => el.id == select.value );
      // cria elemento de FormGroup
      const relatedDrivingSchoolsFG = this.formBuilder.group({
        id: ds.id,
        company: this.formBuilder.group({
          id: ds.company.id,
          name: ds.company.name
        })
      });
      // adiciona ao form
      (this.form.get('relatedDrivingSchools') as FormArray).push(relatedDrivingSchoolsFG);
    }
  }

  /**
   * remove um item da lista de cfcs
   * @param {number} id id do cfc
   */
  public removeSelectedCfc(id:number): void {
    // indice
    const i = this.form.get('relatedDrivingSchools').value.findIndex( el => el.id == id );
    // remove o item
    (this.form.get('relatedDrivingSchools') as FormArray).removeAt(i);
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
    this.onChangeValues();
    if ( this.form.valid ) {
      // remove caracteres
      this.form.get('company.cnpj').setValue( this.form.get('company.cnpj').value.replace(/[^\d]+/g,'') );
      this.form.get('company.phoneNumber').setValue( this.form.get('company.phoneNumber').value.replace(/[^\d]+/g,'') );
      this.form.get('company.address.zipcode').setValue( this.form.get('company.address.zipcode').value.replace(/[^\d]+/g,'') );

      this._send(this.data.id, this.sharedUnitService, this.dialogRef);

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
    let cep = this.form.get('company.address.zipcode').value;
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
              this.form.get('company.address.street').setValue(resCep.logradouro);
              this.form.get('company.address.cityArea').setValue(resCep.bairro);
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
                    this.form.get('company.address.city.id').setValue(idCity);
                  },
                  error => {
                    console.error(error);
                    // exibe mensagem de erro
                    this.errorMsgSent = this.txt.messages.errorCep;
                    // esconde a mensagem de erros apos 5 seg
                    setTimeout(() => this.errorMsgSent = null , 5000);
                    // exibe mensagem de erro
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
                this.form.get('company.address.city.id').setValue(null);
                // limpa lista de cidades
                this.listCities = [];
              }
          } );
      }
    }

    this.onChangeValues();
  }

}
