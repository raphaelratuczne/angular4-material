import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';
import { VehicleModel } from '../vehicle-model.model';
import { VehicleModelService } from '../vehicle-model.service';
import { VehicleType, VehicleTypeService } from '../../vehicle-type';

@Component({
  templateUrl: 'vehicle-model-dialog.component.html',
})
export class VehicleModelDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // flag do titulo
  public forAdd: boolean;
  // lista de tipos de veículos
  public listVehicleTypes: VehicleType[];
  // mascara de codigo - somente numeros
  public codeMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];


  constructor(@Inject(MD_DIALOG_DATA) public data: VehicleModel,
              private dialogRef: MdDialogRef<VehicleModelDialogComponent>,
              private vehicleModelService: VehicleModelService,
              private vehicleTypeService: VehicleTypeService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','vehicleModel']);

    // seta flag se esta adicionando ou editando os valores
    this.forAdd = (Object.assign({}, this.data)).id !== null;
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      id: [],
      description: [],
      vehicleType: [],
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
      vehicleType: {
        required: this.txt.fields.vehicleType.errors.required,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de tipos de veículos
    this.vehicleTypeService.loadData()
        .subscribe(
        res => {
          // console.log(res);
          this.listVehicleTypes = res;
          this.setVehicleTypes();
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
      id: [
        {value: this.data.id, disabled: (this.data.id !== null ? true : false)},
        [Validators.required, Validators.maxLength(6), CustomValidators.number]],
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(20)]],
      vehicleType: [
        {value: null, disabled: true},
        Validators.required],
    });

    // observa as mudancas
    this._afterBuildForm();

    this.setVehicleTypes();
  }

  /**
   * seta o valor do campo de tipo de veículos
   */
  private setVehicleTypes(): void {
    if (this.form && this.listVehicleTypes) {
      let value = this.data.vehicleType ? this.data.vehicleType.id : null;
      this.form.get('vehicleType').setValue(value);
      this.form.get('vehicleType').enable();
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

    // seta o valor como o objeto de tipo de veículos
    const idV = this.form.get('vehicleType').value;
    this.form.get('vehicleType').setValue( this.listVehicleTypes.find( v => v.id == idV ) );

    this._send(this.data.id, this.vehicleModelService, this.dialogRef);

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
