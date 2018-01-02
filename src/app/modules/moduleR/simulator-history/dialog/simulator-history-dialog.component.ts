import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { DateLocale } from 'md2';

import { CommonFormComponent } from 'app/shared';
import { SimulatorHistory } from '../simulator-history.model';
import { SimulatorHistoryService } from '../simulator-history.service';
import { Company, DrivingSchoolService } from '../../driving-school';
import { SharedUnitService } from '../../shared-unit';
import { Simulators, SimulatorsService } from '../../simulators';
import { SoftwareVersion, SoftwareVersionService } from '../../../moduleCf/software-version';

@Component({
  templateUrl: 'simulator-history-dialog.component.html',
})
export class SimulatorHistoryDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // campo virgente
  public isActualy: boolean = false;
  // campo radio alocado
  public company: string;
  // lista de simuladores
  public simulatorsList: Simulators[];
  // lista de versoes de software de simulacao
  public softwareVersionList: SoftwareVersion[];
  // lista de empresas
  public companyList: Company[];

  constructor(@Inject(MD_DIALOG_DATA) public data: SimulatorHistory,
              private dialogRef: MdDialogRef<SimulatorHistoryDialogComponent>,
              private dateLocale: DateLocale,
              private simulatorHistoryService: SimulatorHistoryService,
              private simulatorsService: SimulatorsService,
              private softwareVersionService: SoftwareVersionService,
              private drivingSchoolService: DrivingSchoolService,
              private sharedUnitService: SharedUnitService,
              private injector:Injector) {
    //                modulo         pagina
    super(injector, ['moduleR','simulatorHistory']);

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
      'simulator.id': [],
      startDate: [],
      endDate: [],
      'softwareVersion.id': [],
      'company.id': [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      'simulator.id': {
        required: this.txt.fields.serialNumber.errors.required,
      },
      startDate: {
        required: this.txt.fields.startDate.errors.required,
      },
      endDate: {
        required: this.txt.fields.endDate.errors.required,
        bigger: this.txt.fields.endDate.errors.bigger,
      },
      'softwareVersion.id': {
        required: this.txt.fields.softwareVersion.errors.required,
      },
      'company.id': {
        required: this.txt.fields.company.errors.required,
      },
    };
    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);

    // carrega lista de simuladores
    this.simulatorsService.loadData()
      .subscribe(
        res => {
          this.simulatorsList = res;
          if ( this.form )
            this.form.get('simulator.id').enable();

          // console.log('lista simuladores ->', this.simulatorsList);
        },
        error => {
          // exibe mensagem de erro
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          // fecha o dialog
          this.dialogRef.close('error');
        }
      );

    // carrega lista de versoes
    this.softwareVersionService.loadData()
      .subscribe(
        res => {
          this.softwareVersionList = res;
          if ( this.form )
            this.form.get('softwareVersion.id').enable();

          // console.log('lista versoes ->', this.softwareVersionList);
        },
        error => {
          // exibe mensagem de erro
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          // fecha o dialog
          this.dialogRef.close('error');
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
      startDate: [
        {value: this.data.startDate || null, disabled: false},
        Validators.required],
      endDate: [
        {value: this.data.endDate || null, disabled: false},
        Validators.required],
      company: this.formBuilder.group({
        id: [
          {value:this.data.company.id, disabled: false},
          Validators.required]
      }),
      simulator: this.formBuilder.group({
        id: [
          {value:this.data.simulator.id, disabled: true},
          Validators.required]
      }),
      softwareVersion: this.formBuilder.group({
        id: [
          {value:this.data.softwareVersion.id, disabled: true},
          Validators.required]
      })
    });

    // se a data não foi passada, deixa o campo virgente habilitado
    if ( this.data.id !== null && this.data.endDate == null )
      this.isActualy = true;

    // se passou o valor de alocado, procura pela lista onde pertence
    if ( this.data.company.id !== null ) {
      // procura pela lista de cfc primeiro
      this.drivingSchoolService.loadData()
        .subscribe(
          resDs => {
            // console.log('cfcs ->', resDs);
            let companies = [];
            // flag se encontrou
            let found = false;
            for (let ds of resDs) {
              companies.push( ds.company );
              if ( ds.company.id == this.data.company.id )
                found = true;
            }

            if ( found ) {
              this.companyList = companies;
              this.company = 'drivingSchool';

            } else {
              // se nao encontrou na lista de cfcs, procura nos centros compartilhados
              this.sharedUnitService.loadData()
                .subscribe(
                  resSu => {
                    // console.log('centros ->', resSu);
                    // zera a lista
                    companies = [];
                    for (let su of resSu) {
                      companies.push( su.company )
                    }
                    this.companyList = companies;
                    this.company = 'sharedUnit';
                  },
                  error => {
                    // exibe mensagem de erro
                    this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
                    // fecha o dialog
                    this.dialogRef.close('error');
                  }
                );
            }

          },
          error => {
            // exibe mensagem de erro
            this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
            // fecha o dialog
            this.dialogRef.close('error');
          }
        );
    }

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * se ativar o camo virgente, desativa o campo data termino
   * @param {boolean} isA valor do campo
   */
  changedActualy(isA:boolean): void {
    this.isActualy = isA;
    if ( isA )
      this.form.get('endDate').setValue(null);

    this.onChangeValues();
  }

  /**
   * ao selecionar o cfc/centro, carrega as empresas
   * @param {string} select drivingSchool ou sharedUnit
   */
  public onSelectValue(select:string): void {
    // console.log(select);
    this.form.get('company.id').setValue(null);
    this.form.get('company.id').disable();
    if ( select == 'drivingSchool' ) {
      this.drivingSchoolService.loadData()
        .subscribe(
          res => {
            let companies = [];
            for (let ds of res)
              companies.push( ds.company );

            this.companyList = companies;
            // console.log('CFCs ->', this.companyList);
            this.form.get('company.id').enable();
          },
          error => {
            // exibe mensagem de erro
            this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
            // fecha o dialog
            this.dialogRef.close('error');
          }
        );

    } else if ( select == 'sharedUnit' ) {
      this.sharedUnitService.loadData()
        .subscribe(
          res => {
            let companies = [];
            for (let su of res)
              companies.push( su.company );

            this.companyList = companies;
            // console.log('centros compartilhados ->', this.companyList);
            this.form.get('company.id').enable();
          },
          error => {
            // exibe mensagem de erro
            this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
            // fecha o dialog
            this.dialogRef.close('error');
          }
        );
    }
  }


  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    if ( this.sent ) {
      // se nao setou o campo virgente
      if ( !this.isActualy ) {
        // campo data termino nao pode ser vazio
        if ( this.form.get('endDate').value == null ) {
          this.form.get('endDate').setErrors({required:true});
        }
        // verifica se a data de termino é maior que a data de inicio
        if ( this.form.get('endDate').value != null && this.form.get('startDate').value != null ) {
          const sD = (this.form.get('startDate').value as Date).getTime();
          const eD = (this.form.get('endDate').value as Date).getTime();
          if ( eD <= sD )
            this.form.get('endDate').setErrors({bigger:true});
        }

      } else {
        this.form.get('endDate').setErrors(null);

      }
    }

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

      const simulatorId = this.form.get('simulator.id').value;

      this._send(this.data.id, this.simulatorHistoryService, this.dialogRef, simulatorId);

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
