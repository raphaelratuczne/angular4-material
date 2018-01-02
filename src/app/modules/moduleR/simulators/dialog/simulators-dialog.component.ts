import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { CommonFormComponent } from 'app/shared';
import { Simulators } from '../simulators.model';
import { SimulatorsService } from '../simulators.service';
import { VehicleType, VehicleTypeService } from 'app/modules/moduleCf/vehicle-type';

@Component({
  templateUrl: './simulators-dialog.component.html',
})
export class SimulatorsDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de veiculos
  public listVehicles: VehicleType[];

  constructor(@Inject(MD_DIALOG_DATA) public data: Simulators,
              private dialogRef: MdDialogRef<SimulatorsDialogComponent>,
              private simulatorsService: SimulatorsService,
              private vehicleTypeService: VehicleTypeService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','simulators']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      active: [],
      name: [],
      serialNumber: [],
      vehicleType: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      id: {},
      active: {},
      name: {
        required: this.txt.fields.name.errors.required,
        maxlength: this.txt.fields.name.errors.maxlength,
      },
      serialNumber: {
        required: this.txt.fields.serialNumber.errors.required,
        maxlength: this.txt.fields.serialNumber.errors.maxlength,
      },
      vehicleType: {
        required: this.txt.fields.vehicleType.errors.required,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de veiculos
    this.vehicleTypeService.loadData()
      .subscribe(
        res => {
          // console.log(res);
          this.listVehicles = res;
          this.setVehicles();
        },
        error => {
          console.error(error);
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
      active: [
        {value: (this.data.active !== null ? this.data.active : true), disabled: false}],
      serialNumber: [
        {value: this.data.serialNumber, disabled: (this.data.serialNumber ? true : false)},
        [Validators.required, Validators.maxLength(20)]],
      name: [
        {value: this.data.name, disabled: false},
        [Validators.required, Validators.maxLength(40)]],
      vehicleType: [
        {value: null, disabled: true},
        Validators.required],
    });

    // observa as mudancas
    this._afterBuildForm();

    this.setVehicles();
  }

  /**
   * seta o valor do campo de veiculos
   */
  private setVehicles(): void {
    if (this.form && this.listVehicles) {
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

    // flag de envio
    this.sent = true;
    if ( this.form.valid ) {
      // seta o valor como o objeto de tipo de veiculo
      const idV = this.form.get('vehicleType').value;
      this.form.get('vehicleType').setValue( this.listVehicles.find( v => v.id == idV ) );

      this._send(this.form.get('id').value, this.simulatorsService, this.dialogRef);
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
