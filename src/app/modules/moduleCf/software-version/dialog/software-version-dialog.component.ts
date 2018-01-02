import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { DateLocale } from 'md2';

import { CommonFormComponent } from 'app/shared';
import { SoftwareVersion } from '../software-version.model';
import { SoftwareVersionService } from '../software-version.service';

@Component({
  templateUrl: './software-version-dialog.component.html'
})
export class SoftwareVersionDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  constructor(@Inject(MD_DIALOG_DATA) public data: SoftwareVersion,
              private dialogRef: MdDialogRef<SoftwareVersionDialogComponent>,
              private SoftwareVersionService: SoftwareVersionService,
              private dateLocale: DateLocale,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','softwareVersion']);

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
      version: [],
      description: [],
      releaseDate: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      version: {
        required: this.txt.fields.version.errors.required,
        maxlength: this.txt.fields.version.errors.maxlength,
      },
      description: {
        required: this.txt.fields.description.errors.required,
        maxlength: this.txt.fields.description.errors.maxlength,
      },
      releaseDate: {
        required: this.txt.fields.releaseDate.errors.required,
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
      version: [
        {value: this.data.version, disabled: false},
        [Validators.required, Validators.maxLength(10)]],
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(100)]],
      releaseDate: [
        {value: this.data.releaseDate, disabled: false},
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

    this._send(this.data.id, this.SoftwareVersionService, this.dialogRef);

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
