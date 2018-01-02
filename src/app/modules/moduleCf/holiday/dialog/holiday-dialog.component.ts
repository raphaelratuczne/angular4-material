import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { DateLocale } from 'md2';

import { objectToArray } from 'app/shared';
import { CommonFormComponent } from 'app/shared';
import { Holiday } from '../holiday.model';
import { HolidayService } from '../holiday.service';

@Component({
  templateUrl: 'holiday-dialog.component.html',
})
export class HolidayDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de tipos de feriados
  public typesList: Object[];

  constructor(@Inject(MD_DIALOG_DATA) public data: Holiday,
              private dialogRef: MdDialogRef<HolidayDialogComponent>,
              private holidayService: HolidayService,
              private dateLocale: DateLocale,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','holiday']);

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

    // recupera a lista de categorias
    this.typesList = objectToArray(this.data.typesList);
  }

  ngOnInit() {

    // lista de erros de validacao
    this.formErrors = {
      id: [],
      holidayDate: [],
      description: [],
      type: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      holidayDate: {
        required: this.txt.fields.holidayDate.errors.required,
      },
      description: {
        required: this.txt.fields.description.errors.required,
        maxlength: this.txt.fields.description.errors.maxlength,
      },
      type: {
        required: this.txt.fields.type.errors.required,
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
      holidayDate: [
        {value: this.data.holidayDate, disabled: false},
        Validators.required],
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(50)]],
      type: [
        {value: this.data.type, disabled: false},
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

    this._send(this.data.id, this.holidayService, this.dialogRef);

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
