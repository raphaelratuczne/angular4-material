import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { texts, validateCpf } from 'app/shared';

@Component({
  templateUrl: 'reset-pass-dialog.component.html',
})
export class ResetPassDialogComponent implements OnInit, OnDestroy {

  // textos do layout
  public txt = texts.moduleCf.simulationExercise;
  // objeto de formulario
  public form: FormGroup;
  // referencia para escutar as alteracoes no formulario
  private formChanges: Subscription;
  // se enviou o formulario
  public sent: boolean = false;
  // se esta carregando/enviando
  public loading: boolean = false;
  // mensagem de erro de servico ao enviar
  public errorMsgSent: string;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    private dialogRef: MdDialogRef<ResetPassDialogComponent>,
    private snackBar: MdSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // inicializa o formulario
    this.buildForm();
    // carrega lista de versoes
    // this.softwareVersionService.loadData()
    //   .subscribe(
    //     res => {
    //       // console.log(res);
    //       this.listVersions = res;
    //       this.setVersions();
    //     },
    //     error => {
    //       // console.error(error);
    //       // exibe mensagem de sucesso
    //       this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
    //       this.dialogRef.close('cancel');
    //     }
    //   );
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.formChanges.unsubscribe();
  }

  /**
   * lista de erros de validacao
   */
  public formErrors = {
    code: [],
    description: [],
    softwareVersion: [],
  };

  /**
   * lista de mensagens de erros de validacao
   */
  public validationMessages = {
    id: {},
    code: {
      required: this.txt.fields.code.errors.required,
      maxlength: this.txt.fields.code.errors.maxlength,
      range: this.txt.fields.code.errors.range,
      number: this.txt.fields.code.errors.number,
    },
    description: {
      required: this.txt.fields.description.errors.required,
      maxlength: this.txt.fields.description.errors.maxlength,
    },
    softwareVersion: {
      required: this.txt.fields.softwareVersion.errors.required,
    }
  };

  /**
   * cria o formulario
   */
  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: this.data.id,
      code: [
        {value: this.data.code, disabled: false},
        [Validators.required, Validators.maxLength(6), CustomValidators.range([1, 999999]), CustomValidators.number]],
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(100)]],
      softwareVersion: [
        {value: null, disabled: true},
        Validators.required],
    });

    // observa as mudancas
    this.formChanges = this.form.valueChanges.subscribe( data => this.onChangeValues() );
    // verifica as mudancas
    this.onChangeValues();

    // this.setVersions();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {
    if (!this.form) {
      return;
    }

    for (let field in this.formErrors) {
      // limpa as mensagens de erros anteriores
      this.formErrors[field] = [];
      let control = this.form.get(field);
      // verifica novos erros
      if (control && !control.valid && (control.touched || this.sent)) {
        // let msg = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field].push( this.validationMessages[field][key] );
        }
      }
    }
  }

  /**
   * envia os dados do formulario
   */
  public send(): void {
    // // falg de envio
    // this.sent = true;
    // // verifica erros
    // this.onChangeValues();
    // if ( this.form.valid ) {
    //   this.loading = true;
    //   this.form.disable();
    //
    //   // seta o valor como o objeto de versão de software
    //   const idV = this.form.get('softwareVersion').value;
    //   this.form.get('softwareVersion').setValue( this.listVersions.find( v => v.id == idV ) );
    //
    //   // se passou um id, deve atualizar os dados
    //   if ( this.form.get('id').value !== null ) {
    //     this.simulationExerciseService.editData(this.form.value)
    //       .subscribe(
    //         res => this.responseOk(res),
    //         error => this.responseError(error)
    //       );
    //   } else {
    //     this.simulationExerciseService.sendData(this.form.value)
    //     .subscribe(
    //       res => this.responseOk(res),
    //       error => this.responseError(error)
    //     );
    //   }
    // }
  }

  /**
   * se o resultado da operacao der certo
   * @param {any} res
   */
  private responseOk(res:any): void {
    // console.log('resposta post:', res);
    // flag de carregamento
    this.loading = false;
    // libera o formulario
    this.form.enable();
    // exibe mensagem de sucesso
    this.snackBar.open(this.txt.messages.saved, 'Ok', {duration: 2000});
    // fecha o dialog
    this.dialogRef.close('saved');
  }

  /**
   * se o resultado da operacao der erro
   * @param {any} error
   */
  private responseError(error:any): void {
    console.error(error);
    // verifica o erro retornado
    if ( error.indexOf('uq_simulation_exercise_code_software_version_id') !== -1 ) {
      // exibe mensagem de erro de mesmo codigo para mesmo software
      this.errorMsgSent = this.txt.messages.notSameCodeVersion;
    } else {
      // exibe mensagem de erro
      this.errorMsgSent = this.txt.messages.error + error;
    }
    // flag de carregamento
    this.loading = false;
    // libera o formulario
    this.form.enable();
    // esconde a mensagem de erros apos 5 seg
    setTimeout(() => this.errorMsgSent = null , 5000);
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
