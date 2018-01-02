import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { objectToArray } from 'app/shared';
import { CommonFormComponent } from 'app/shared';
import { SimulationActivity } from '../simulation-activity.model';
import { SimulationActivityService } from '../simulation-activity.service';

@Component({
  templateUrl: 'simulation-activity-dialog.component.html',
})
export class SimulationActivityDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // flag do titulo
  public forAdd: boolean;
  // mascara de codigo - somente numeros
  public codeMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];

  constructor(@Inject(MD_DIALOG_DATA) public data: SimulationActivity,
              private dialogRef: MdDialogRef<SimulationActivityDialogComponent>,
              private simulationActivityService: SimulationActivityService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationActivity']);

    // seta flag se esta adicionando ou editando os valores
    this.forAdd = (Object.assign({}, this.data)).id !== null;
  }

  ngOnInit() {

    // lista de erros de validacao
    this.formErrors = {
      id: [],
      description: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      id: {
        required: this.txt.fields.id.errors.required,
        maxlength: this.txt.fields.id.errors.maxlength,
        number: this.txt.fields.id.errors.number,
      },
      description: {
        required: this.txt.fields.description.errors.required,
        maxlength: this.txt.fields.description.errors.maxlength,
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
      id: [
        {value: this.data.id, disabled: (this.data.id !== null ? true : false)},
        [Validators.required, Validators.maxLength(9), CustomValidators.number]],
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(512)]],
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

    this._send(this.data.id, this.simulationActivityService, this.dialogRef);

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
