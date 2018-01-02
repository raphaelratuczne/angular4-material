/*********
*
* esse componente nao e o mesmo utilizado na janela de matriculas na
* lista de alunos, ha poucas diferenças entre os dois mas qualquer alteracao
* aqui deve ser replicada la.
*
**********/

import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
// import { CustomValidators } from 'ng2-validation';
// import { Subscription } from 'rxjs/Rx';
import { MdSnackBar, MdDialog } from '@angular/material';

import { CommonFormComponent,
         moneyToNumber,
         numberToMoney,
         ConfirmDialogComponent,
         confirmDialogModel } from 'app/shared';
import { Enrollment, Account } from './enrollment.model';
import { EnrollmentService } from './enrollment.service';
import { Student,
         Person,
         StudentService } from '../../moduleR/student';
import { Contract } from '../../moduleF/contract';

@Component({
  selector: 'moduleA-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de alunos para o autocomplete
  public items: Array<{id:number, name:string}> = [];
  // lista de categorias
  public listCategories: Array<{id:number, value: string}>;
  // lista de tipos de aulas
  public listLessonTypes: Array<{id:number, value: string}>;
  // lista de formas de pgto
  public listPaymentTypes: Array<{id:number, value: string}>;
  // valores do contrato
  private account: Account;
  // dados do contrato atual
  private current: Contract;
  // maximo de caracteres qtdade aulas/carga horaria
  public maxLength: number = 6;
  public numMaskLessons = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];
  // valor da matricula
  public enrollmentValue:string;
  // flag se existe contrato
  public hasContract: boolean = false;

  constructor(private enrollmentService: EnrollmentService,
              private studentService: StudentService,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo    pagina
    super(injector, ['moduleA','enrollment']);
  }

  ngOnInit() {
    // popula lista de categorias
    this.listCategories = [];
    for (let item of this.txt.fields.lessonsCategory.options) {
      this.listCategories.push( {id: item.id, value: item.value} );
    }

    // popula lista de tipos de aulas
    this.listLessonTypes = [];
    for (let item of this.txt.fields.lessonsType.options) {
      this.listLessonTypes.push( {id: item.id, value: item.value} );
    }

    // lista de erros de validacao
    this.formErrors = {
      student:[],
    	lessonsCategory: [],
    	lessonsType: [],
    	departmentProcessNumber: [],
    	numLessonsLoaded: [],
      paymentValue: [],
      paymentType: [],
    	totalValueOfContract: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
    	student: {
        required: this.txt.fields.student.errors.required,
      },
    	lessonsCategory: {
        required: this.txt.fields.lessonsCategory.errors.required,
      },
    	lessonsType: {
        required: this.txt.fields.lessonsType.errors.required,
      },
    	numLessonsLoaded: {
        required: this.txt.fields.numLessonsLoaded.errors.required,
        maxlength: this.txt.fields.numLessonsLoaded.errors.maxlength,
        maxlength2: this.txt.fields.numLessonsLoaded.errors.maxlength2,
        min: this.txt.fields.numLessonsLoaded.errors.min,
      },
      paymentType: {
        required: this.txt.fields.paymentType.errors.required,
      },
      departmentProcessNumber: {
        required: this.txt.fields.departmentProcessNumber.errors.required,
        maxlength: this.txt.fields.departmentProcessNumber.errors.maxlength,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(21);
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
      student: [
        {value: null, disabled: true},
        Validators.required],
      lessonsCategory: [
        {value: 2, disabled: true},
        Validators.required],
      lessonsType: [
        {value: null, disabled: true},
        Validators.required],
      numLessonsLoaded: [
        {value: null, disabled: true},
        Validators.required],
      paymentType: [
        {value: null, disabled: true}],
      departmentProcessNumber: [
        {value: null, disabled: true},
        Validators.maxLength(50)],
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

    // pega os valores
    const departmentProcessNumber = this.form.get('departmentProcessNumber').value;
    const numLessonsLoaded = this.form.get('numLessonsLoaded').value;
    const lessonsType = this.form.get('lessonsType').value;
    const paymentType = this.form.get('paymentType').value;

    // verifica o tipo de aula selecionado
    if ( lessonsType === 0 ) {
      // valida de digitou o numero do processo
      if ( !departmentProcessNumber || departmentProcessNumber.length < 1 ) {
        this.form.get('departmentProcessNumber').setErrors({required:true});
      } else {
        this.form.get('departmentProcessNumber').setErrors(null);
      }
    } else {
      this.form.get('departmentProcessNumber').setErrors(null);
    }

    // verifica a carga horaria/qtdade de aulas
    if (lessonsType === null || lessonsType === 0 || lessonsType === 1 ) {
      // seta o maximo de caracteres
      this.maxLength = 6;
      // valida maximo de caracteres
      if ( String(numLessonsLoaded).length > 6 ) {
        this.form.get('numLessonsLoaded').setErrors({maxlength:true});
      } else {
        this.form.get('numLessonsLoaded').setErrors(null);
      }

    }

    // valida forma de pagamento
    if ( paymentType === null && lessonsType !== 2 ) {
      this.form.get('paymentType').setErrors({required:true});
    } else {
      this.form.get('paymentType').setErrors(null);
    }

    // calcula o valor da matricula
    if ( (lessonsType === 0 || lessonsType === 1) && numLessonsLoaded > 0 ) {
      this.enrollmentValue = this.txt.fields.enrollmentValue.label.replace(/{result}|{value}/g, v => {
        if (v == '{result}') {
          return numberToMoney( +numLessonsLoaded * moneyToNumber(String(this.current.lessonPrice)) );
        } else {
          return this.current.lessonPrice;
        };
      } );
    } else if ( (lessonsType === 0 || lessonsType === 1) && (numLessonsLoaded == 0 || numLessonsLoaded == '') ) {
      this.enrollmentValue = this.txt.fields.enrollmentValue.label.replace(/{result}|{value}/g, v => (v == '{result}') ? 'R$ 0,00' : this.current.lessonPrice );
    }

    // se for aula livre
    if ( lessonsType === 2 ) {
      // seta o maximo de caracteres
      this.maxLength = 2;
      // valida maximo de caracteres
      if ( String(numLessonsLoaded).length > 2 ) {
        this.form.get('numLessonsLoaded').setErrors({maxlength2:true});
      } else {
        this.form.get('numLessonsLoaded').setErrors(null);
      }

      this.enrollmentValue = 'R$ 0,00';
    }

    // valida carga horaria
    if ( +numLessonsLoaded < 1 ) {
      this.form.get('numLessonsLoaded').setErrors({required:true});
    } else {
      // this.form.get('numLessonsLoaded').setErrors(null);
    }

    this._onChangeValues();

  }

  /**
   * solicita os dados 011 983797802
   */
  private loadData(): void {

    // carrega lista de alunos
    this.studentService.loadData()
      .subscribe(
        resStudent => {
          // console.log('carregou alunos:', resStudent);
          // adiciona na lista de procura
          for (let s of resStudent)
            this.items.push( { id: s.id, name: s.person.name } );

          // carrega valores do contrato
          this.enrollmentService.loadAccount()
            .subscribe(
              resAccount => {
                // console.log('carregou conta:', resAccount);
                this.account = resAccount;
                // inicia a lista
                this.listPaymentTypes = [];
                // substitui os valores
                for (let item of this.txt.fields.paymentType.options) {
                  // se tem dinheiro em caixa
                  if ( item.id === 0 && moneyToNumber(String(this.account.cashBalance)) > 0 ) {
                    // adiciona a lista
                    this.listPaymentTypes.push( {id: item.id, value: item.value.replace('{value}', String(this.account.cashBalance))} );
                    // se tem credito, deixa a opcao setada
                    this.form.get('paymentType').setValue(0);
                  }
                  // se possui bonus
                  if ( item.id === 1 && this.account.bonusBalance > 0 ) {
                    // adiciona a lista
                    this.listPaymentTypes.push( {id: item.id, value: item.value.replace('{bonus}', String(this.account.bonusBalance))} );
                  }
                }

                // carrega dados do contrato atual
                this.enrollmentService.loadCurrent()
                  .subscribe(
                    resCurrent => {
                      // console.log('carregou dados do contrato atual', resCurrent);
                      this.current = resCurrent;

                      this.enrollmentValue = this.txt.fields.enrollmentValue.label.replace(/{result}|{value}/g, v => (v == '{result}') ? 'R$ 0,00' : this.current.lessonPrice );

                      // habilita o formulario
                      this.form.enable();
                    },
                    error => {
                      console.log(error);
                      this.hasContract = true;
                    }
                  );
              }
            );
        }
      );

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    // this._send(null, this.enrollmentService, null, this.form.get('student').value);

    // falg de envio
    this.sent = true;
    // verifica erros
    this.onChangeValues();

    if ( this.form.valid ) {
      this.loading = true;
      this.form.disable();

      this.enrollmentService.sendData(this.form.value, this.form.get('student').value)
        .subscribe(
          res => {
            // console.log('resposta matricula:', res);
            this.sent = false;
            this.form.reset();
            this.form.get('lessonsCategory').setValue(2);
            this.form.clearValidators();
            this.form.clearAsyncValidators();
            // flag de carregamento
            this.loading = false;
            // libera o formulario
            this.form.enable();
            this.loadData();
            // exibe o dialog de confirmacao
            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '400px',
              data: new confirmDialogModel({
                title: this.txt.modal.title,
                text: this.txt.modal.messages.replace('{number}', res['id']),
                buttonOk: this.txt.modal.buttons.ok,
                buttonCancel: this.txt.modal.buttons.cancel
              })
            });
            // this.responseOk(res, null);
          },
          error => this.responseError(error)
        );

    }
  }

  cancel() {}

}
