import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Subscription } from 'rxjs/Rx';
import { MdSnackBar, MdDialog } from '@angular/material';

import { CommonFormComponent, confirmDialogModel, ConfirmDialogComponent } from 'app/shared';
import { Bonus, BonusTypes } from './bonus.model';
import { BonusService } from './bonus.service';
import { BonusReverseDialogComponent } from './dialog/bonus-reverse-dialog.component';
import { DrivingSchool, DrivingSchoolService } from '../../moduleR/driving-school';

@Component({
  selector: 'moduleF-bonus-entry',
  templateUrl: './bonus-entry.component.html',
  styleUrls: ['./bonus-entry.component.scss']
})
export class BonusEntryComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de cfcs
  public cfcList: DrivingSchool[] = [];
  // mascara de numeros
  public qtMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];
  // lista de bonus
  public bonusList: Bonus[] = [];
  // tipos de bonus
  public bonusType = BonusTypes;

  constructor(private bonusService: BonusService,
              private drivingSchoolService: DrivingSchoolService,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','bonusEntry']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      drivingSchoolId: [],
      bonusValue: [],
      justification: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      drivingSchoolId: {
        required: this.txt.fields.drivingSchoolId.errors.required,
      },
      bonusValue: {
        required: this.txt.fields.bonusValue.errors.required,
        maxlength: this.txt.fields.bonusValue.errors.maxlength,
        number: this.txt.fields.bonusValue.errors.number,
      },
      justification: {
        required: this.txt.fields.justification.errors.required,
        maxlength: this.txt.fields.justification.errors.maxlength,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(25);

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
      drivingSchoolId: [
        {value: null, disabled: true},
        Validators.required],
      bonusValue: [
        {value: null, disabled: false},
        [Validators.required, Validators.maxLength(6), CustomValidators.number]],
      justification: [
        {value: null, disabled: false},
        [Validators.required, Validators.maxLength(500)]]
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

    this._onChangeValues();
    // console.log(this.formErrors);

  }


  /**
   * solicita os dados
   */
  private loadData(): void {

    // carrega lista de CFCs
    this.drivingSchoolService.loadData()
      .subscribe(
        res => {
          this.cfcList = res;
          this.form.get('drivingSchoolId').enable();
          // seleciona o 1º cfc e carrega os dados
          if ( this.cfcList.length > 0 ) {
            this.form.get('drivingSchoolId').setValue( this.cfcList[0].id );
            this.onChooseCfc( this.cfcList[0].id );
          }
        }
      );

  }

  public onChooseCfc(dsId:number): void {
    // flag de carregamento
    this.loading = true;
    this.bonusService.loadData(dsId, {last:5})
      .subscribe(
        res => {
          // console.log(res);
          // flag de carregamento
          this.loading = false;

          this.bonusList = res;
        },
        error => {
          console.error(error);
          // se o erro for 404, não exibe mensagem
          if ( error.substr(0,3) !== '404' ) {
            // exibe mensagem de erro
            this.errorMsgLoading = this.txt.messages.error + error;
          }
          // flag de carregamento
          this.loading = false;
        }
      );

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    // guarda o id do cfc
    const cfcId = this.form.get('drivingSchoolId').value;

    // falg de envio
    this.sent = true;
    // verifica erros
    this.onChangeValues();

    if ( this.form.valid ) {

      // substitui os termos na msg
      const msg = this.txt.modalConfirmEntry.messages.replace(/{bonus}|{drivingSchool}/gi, val => {
        if ( val == '{bonus}' )
          return this.form.get('bonusValue').value
        else
          return this.cfcList.find( cfc => cfc.id == cfcId ).company.name
      });

      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: new confirmDialogModel({
          title: this.txt.modalConfirmEntry.title,
          text: msg,
          buttonOk: this.txt.modalConfirmEntry.buttons.ok,
          buttonCancel: this.txt.modalConfirmEntry.buttons.cancel
        })
      });
      // // escuta resposta do dialog
      let respDialog = dialogRef.afterClosed().subscribe(result => {
        // se clicou em ok
        if (result && result.choice == 'ok') {

          this.loading = true;
          this.form.disable();

          this.bonusService.sendData(this.form.value, cfcId)
            .subscribe(
              res => {
                this.responseOk(res, null);
                this.sent = false;
                this.form.reset();
                this.form.get('drivingSchoolId').setValue(cfcId);
                this.onChooseCfc(cfcId);
              },
              error => this.responseError(error)
            );
        }
        // cancela escuta pela resposta
        respDialog.unsubscribe();
      });

    }

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Bonus} data dados para o formulario
   */
  public showForm(data: Bonus): void {

    // pega o id do cfc selecionado
    const cfcId = this.form.get('drivingSchoolId').value;
    // pega o nome do cfc selecionado
    data.drivingSchoolname = this.cfcList.find( cfc => cfc.id == cfcId ).company.name;

    let dialogRef = this.dialog.open(BonusReverseDialogComponent, {
      width: '600px',
      data: data
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // se clicou em ok
      if (result && result == 'saved') {
        // se salvou, carrega novamente a lista
        this.onChooseCfc(cfcId);
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });

  }

  cancel() {}

}
