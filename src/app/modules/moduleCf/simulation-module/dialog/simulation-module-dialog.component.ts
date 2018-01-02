import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';
import { SimulationModule } from '../simulation-module.model';
import { SimulationModuleService } from '../simulation-module.service';
import { SoftwareVersion, SoftwareVersionService } from '../../software-version';
import { SimulationExercise, SimulationExerciseService } from '../../simulation-exercise';
import { DepartmentService } from '../../department'

@Component({
  templateUrl: 'simulation-module-dialog.component.html',
})
export class SimulationModuleDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // mascara da identificação no departamento
  public numMaskIdentifierOnDepartment = [/\d/,/\d/,/\d/,/\d/,/\d/];

  // flag verificação estado (Detran-RJ)
  public isDetranRJ: boolean;

  // lista de versoes
  public listVersions: SoftwareVersion[];
  // lista de exercicios
  private listSimulationExercise: SimulationExercise[];

  constructor(@Inject(MD_DIALOG_DATA) public data: SimulationModule,
              private dialogRef: MdDialogRef<SimulationModuleDialogComponent>,
              private simulationModuleService: SimulationModuleService,
              private softwareVersionService: SoftwareVersionService,
              private simulationExerciseService: SimulationExerciseService,
              private departmentService: DepartmentService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationModule']);

    this.departmentService.loadData()
     .subscribe( res => {
        //19 -> RJ
        this.isDetranRJ = res.state.toString() == "19" ? true : false;
    });
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      description: [],
      identifierOnDepartment: [],
      'softwareVersion.id': [],
      exercises: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      description: {
        required: this.txt.fields.description.errors.required,
        maxlength: this.txt.fields.description.errors.maxlength,
      },
      identifierOnDepartment: {
        required: this.txt.fields.identifierOnDepartment.errors.required,
        maxlength: this.txt.fields.identifierOnDepartment.errors.maxlength,
        max: this.txt.fields.identifierOnDepartment.errors.max,
      },
      'softwareVersion.id': {
        required: this.txt.fields.softwareVersion.errors.required,
      },
      exercises: {
        minLength: this.txt.fields.exercises.errors.minLength,
      },
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
          this.enableSoftwareVersion();
        },
        error => {
          console.error(error);
          // exibe mensagem de sucesso
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          this.dialogRef.close('cancel');
        }
      );

    // carrega lista de exercicios
    this.simulationExerciseService.loadData()
      .subscribe(
        res => {
          // console.log(res);
          this.listSimulationExercise = res;
        },
        error => {
          console.error(error);
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
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(100)]],
      identifierOnDepartment: [
        {value: this.data.identifierOnDepartment, disabled: false},
        Validators.maxLength(5)],
      softwareVersion: this.formBuilder.group({
        id: [
          {value: this.data.softwareVersion.id, disabled: true},
          Validators.required]
      }),
      exercises: this.formBuilder.array([])
    });

    // se possui exercicios
    if ( this.data.exercises ) {
      // cria elemento de FormGroup
      const exercisesFG = this.data.exercises.map( simExe => this.formBuilder.group({
        id: simExe.id,
        description: simExe.description
      }) );
      // cria o FormArray
      const exercisesArray = this.formBuilder.array(exercisesFG);

      // adiciona ao form
      this.form.setControl('exercises', exercisesArray);
    }

    // observa as mudancas
    this._afterBuildForm();

    this.enableSoftwareVersion();
  }

  /**
   * get de exercises
   * @return {FormArray}
   */
  public get exercises(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  /**
   * seta o valor do campo de versões
   */
  private enableSoftwareVersion(): void {
    if (this.form && this.listVersions) {
      this.form.get('softwareVersion.id').enable();
    }
  }

  /**
   * ao mudar o valor de softwareVersion, zera os exercises
   */
  public onChange(): void {
    this.form.setControl('exercises', this.formBuilder.array([]));
  }

  /**
   * retorna a lista de exercicios filtrada pela versao
   * @return {SimulationExercise[]} lista de exercicios
   */
  public getListSimulationExercise(): SimulationExercise[] {
    if ( !this.listSimulationExercise )
      return [];

    return this.listSimulationExercise.filter( se => {
      if ( this.form.get('softwareVersion.id').value == null )
        return false;

      return se.softwareVersion.id == this.form.get('softwareVersion.id').value;

    } );
  }

  /**
   * ao selecionar o exercicio, adiciona ao campo
   * @param {number} id id do exercicio
   */
  public onSelectValue(select): void {
    // verifica se já foi adicionado
    if ( this.form.get('exercises').value.findIndex( simExe => simExe.id == select.value ) == -1 ) {
      // encontra o item
      const se = this.listSimulationExercise.find( el => el.id == select.value );
      // cria elemento de FormGroup
      const exercisesFG = this.formBuilder.group({
        id: se.id,
        description: se.description
      });
      // adiciona ao form
      (this.form.get('exercises') as FormArray).push(exercisesFG);
    }
  }

  /**
  * remove um item da lista de exercicios
  * @param {number} id id do exercicio
  */
  removeSelectedSimExe(id: number): void {
    // indice
    const i = this.form.get('exercises').value.findIndex( el => el.id == id );
    // remove o item
    (this.form.get('exercises') as FormArray).removeAt(i);
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    if (this.sent && this.isDetranRJ && this.form.get('identifierOnDepartment').value == '')
      this.form.get('identifierOnDepartment').setErrors({required:true});

    if (this.sent && this.isDetranRJ && this.form.get('identifierOnDepartment').value > 32767)
      this.form.get('identifierOnDepartment').setErrors({max:true});

    // faz a validacao de exercises manualmente
    if (this.sent && this.form.get('exercises').value.length < 1 )
      this.form.get('exercises').setErrors({minLength:true});

    this._onChangeValues();

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(this.data.id, this.simulationModuleService, this.dialogRef);

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
