import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';

import { CommonFormComponent, confirmDialogModel, ConfirmDialogComponent } from 'app/shared';
import { Bonus } from '../bonus.model';
import { BonusService } from '../bonus.service';

@Component({
  templateUrl: 'bonus-reverse-dialog.component.html',
})
export class BonusReverseDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // nome do cfc selecionado
  public drivingSchoolname: string;

  constructor(@Inject(MD_DIALOG_DATA) public data:Bonus,
              private dialogRef: MdDialogRef<BonusReverseDialogComponent>,
              private dialog: MdDialog,
              private bonusService: BonusService,
              private injector:Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','bonusEntry']);

    // recupera o nome da cfc
    this.drivingSchoolname = this.data.drivingSchoolname;
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      justification: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      justification: {
        required: this.txt.fields.justification.errors.required,
        maxlength: this.txt.fields.justification.errors.maxlength,
      }
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
      drivingSchoolname: [
        {value: this.data.drivingSchoolname, disabled: true}],
      bonusValue: [
        {value: this.data.bonusValue, disabled: true}],
      justification: [
        {value: (!this.data.reversed && this.data.bonusValue > 0 ? null : this.data.justification) , disabled: (this.data.reversed || this.data.bonusValue < 0)},
        [Validators.required, Validators.maxLength(500)]],
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
    this.onChangeValues();
    if ( this.form.valid ) {

      // substitui os termos na msg
      const msg = this.txt.modalConfirmCancel.messages.replace(/{bonus}|{drivingSchool}/gi, val => {
        if ( val == '{bonus}' )
          return this.data.bonusValue
        else
          return this.data.drivingSchoolname
      });

      // janela de confirmação
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: new confirmDialogModel({
          title: this.txt.modalConfirmCancel.title,
          text: msg,
          buttonOk: this.txt.modalConfirmCancel.buttons.ok,
          buttonCancel: this.txt.modalConfirmCancel.buttons.cancel
        })
      });
      // // escuta resposta do dialog
      let respDialog = dialogRef.afterClosed().subscribe(result => {
        // se clicou em ok
        if (result && result.choice == 'ok') {

          this.loading = true;
          this.form.disable();

          this.bonusService.editData(this.data.id, this.form.get('justification').value)
            .subscribe(
              res => this.responseOk(res, this.dialogRef),
              error => this.responseError(error)
            );

        }
        // cancela escuta pela resposta
        respDialog.unsubscribe();
      });

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
