import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';
import { SimulationModule } from '../simulation-module.model';
import { SimulationModuleService } from '../simulation-module.service';
import { SoftwareVersion, SoftwareVersionService } from '../../software-version';

@Component({
  templateUrl: 'simulation-module-clone-dialog.component.html'
})
export class SimulationModuleCloneDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de versoes
  public listVersions: SoftwareVersion[];

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              private dialogRef: MdDialogRef<SimulationModuleCloneDialogComponent>,
              private simulationModuleService: SimulationModuleService,
              private softwareVersionService: SoftwareVersionService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationModule']);
  }

  ngOnInit() {
    //  lista de erros de validacao
    this.formErrors = {
      sourceSoftwareVersionId: [],
      destSoftwareVersionId: [],
    };

    //  lista de mensagens de erros de validacao
    this.validationMessages = {
      sourceSoftwareVersionId: {
        required: this.txt.fields.sourceSoftwareVersionId.errors.required,
      },
      destSoftwareVersionId: {
        required: this.txt.fields.destSoftwareVersionId.errors.required,
        notEqualTo: this.txt.fields.destSoftwareVersionId.errors.notEqualTo,
      },
    };

    // inicializa o formulario
    this.buildForm();

    // registra o listenner
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
    let sourceSoftwareVersionId = new FormControl({value: null, disabled: true}, Validators.required);
    let destSoftwareVersionId = new FormControl({value: null, disabled: true}, [Validators.required, CustomValidators.notEqualTo(sourceSoftwareVersionId)]);

    this.form = this.formBuilder.group({
      sourceSoftwareVersionId: sourceSoftwareVersionId,
      destSoftwareVersionId: destSoftwareVersionId
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
      this.form.enable();
    }
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  public send(): void {

    // falg de envio
    this.sent = true;
    // verifica erros
    this.onChangeValues();
    if ( this.form.valid ) {
      this.loading = true;
      this.form.disable();

      this.simulationModuleService.cloneData(this.form.get('sourceSoftwareVersionId').value, this.form.get('destSoftwareVersionId').value)
      .subscribe(
        res => this.responseOk(res, this.dialogRef),
        error => this.responseError(error)
      );
    }
  }

  public cancel(): void {
    this.dialogRef.close('cancel');
  }
}
