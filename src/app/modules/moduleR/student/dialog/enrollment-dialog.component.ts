/*********
*
* esse componente nao e o mesmo utilizado na pagina de matriculas,
* ha poucas diferenças entre os dois mas qualquer alteracao aqui deve
* ser replicada la.
*
**********/

import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar, MdDialog } from '@angular/material';

import { CommonFormComponent,
         moneyToNumber,
         numberToMoney,
         ConfirmDialogComponent,
         confirmDialogModel } from 'app/shared';
import { Student, Person } from '../student.model';
import { StudentService } from '../student.service';
import { Enrollment,
         Account } from '../../../moduleA/enrollment/enrollment.model';
import { EnrollmentService } from '../../../moduleA/enrollment/enrollment.service';
import { Contract } from '../../../moduleF/contract';

@Component({
  templateUrl: 'enrollment-dialog.component.html',
})
export class EnrollmentDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

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
  // valor da matricula
  public enrollmentValue:string;
  // flag se existe contrato
  public hasContract: boolean = false;

  constructor(@Inject(MD_DIALOG_DATA) public data: Student,
              private dialogRef: MdDialogRef<EnrollmentDialogComponent>,
              private enrollmentService: EnrollmentService,
              private studentService: StudentService,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo    pagina
    super(injector, ['moduleA','enrollment']);

    // pega dados do aluno
    this.items = [{id: this.data.id, name: this.data.person.name}];
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
        {value: this.data.id, disabled: true},
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
   * solicita os dados
   */
  private loadData(): void {

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

  /**
   * envia os dados do formulario
   */
  public send(): void {

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
            // exibe o dialog de confirmacao
            this.responseOk(res, this.dialogRef);
            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '400px',
              data: new confirmDialogModel({
                title: this.txt.modal.title,
                text: this.txt.modal.messages.replace('{number}', res['id']),
                buttonOk: this.txt.modal.buttons.ok,
                buttonCancel: this.txt.modal.buttons.cancel
              })
            });
          },
          error => this.responseError(error)
        );

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
