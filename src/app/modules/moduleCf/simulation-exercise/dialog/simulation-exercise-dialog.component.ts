import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';
import { SimulationExercise } from '../simulation-exercise.model';
import { SimulationExerciseService } from '../simulation-exercise.service';
import { SoftwareVersion, SoftwareVersionService } from '../../software-version';

@Component({
  templateUrl: 'simulation-exercise-dialog.component.html',
})
export class SimulationExerciseDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de versoes
  public listVersions: SoftwareVersion[];
  // mascara de codigo - somente numeros
  public codeMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];

  constructor(@Inject(MD_DIALOG_DATA) public data: SimulationExercise,
              private dialogRef: MdDialogRef<SimulationExerciseDialogComponent>,
              private simulationExerciseService: SimulationExerciseService,
              private softwareVersionService: SoftwareVersionService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationExercise']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      code: [],
      description: [],
      softwareVersion: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
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

    // inicializa o formulario
    this.buildForm();

    // // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de versoes
    this.softwareVersionService.loadData()
      .subscribe(
        res => {
          // console.log(res);
          this.listVersions = res;
          this.setVersions();
        },
        error => {
          // console.error(error);
          // exibe mensagem de sucesso
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          this.dialogRef.close('cancel');
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
    this._afterBuildForm();

    this.setVersions();
  }

  /**
   * seta o valor do campo de versões
   */
  private setVersions(): void {
    if (this.form && this.listVersions) {
      let value = this.data.softwareVersion ? this.data.softwareVersion.id : null;
      this.form.get('softwareVersion').setValue(value);
      this.form.get('softwareVersion').enable();
    }
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

    // seta o valor como o objeto de versão de software
    const idV = this.form.get('softwareVersion').value;
    this.form.get('softwareVersion').setValue( this.listVersions.find( v => v.id == idV ) );

    this._send(this.data.id, this.simulationExerciseService, this.dialogRef);

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
