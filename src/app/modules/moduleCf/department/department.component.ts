import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { State, StateService, CommonFormComponent } from 'app/shared';

@Component({
  selector: 'moduleCf-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de estados
  public ufList: State[];
  // lista de formas de interacao
  public wsList = [{value: '1', text:'Webservice'}];

  constructor(private departmentService: DepartmentService,
              private stateService: StateService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','department']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      name: [],
      state: [],
      communicationType: [],
      webserviceAddress: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      name: {
        required: this.txt.fields.name.errors.required,
        maxlength: this.txt.fields.name.errors.maxlength,
      },
      state: {
        required: this.txt.fields.state.errors.required,
      },
      communicationType: {
        required: this.txt.fields.communicationType.errors.required,
      },
      webserviceAddress: {
        required: this.txt.fields.webserviceAddress.errors.required,
        maxlength: this.txt.fields.webserviceAddress.errors.maxlength,
        url: this.txt.fields.webserviceAddress.errors.url,
      }
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(3);
  }

  ngOnDestroy() {
    // // cancela o listenner ao sair
    this.cancelListenners();
  }

  /**
   * cria o formulario
   */
  public buildForm(): void {
    this.form = this.formBuilder.group({
      name: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(20)]],
      state: [
        {value: null, disabled: true},
        Validators.required],
      communicationType: [
        {value: '1', disabled: true},
        Validators.required],
      webserviceAddress: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(200), CustomValidators.url]],
    });

    // observa as mudancas
    this._afterBuildForm();

    // carrega os estados
    this.stateService.getStates()
      .subscribe(
        res => {
          // console.log(res);
          this.ufList = res;
          // carrega os dados
          this.loadData();
        },
        error => {
          console.error(error);
          // exibe mensagem de erro
          this.errorMsgLoading = this.txt.messages.error + error;
          // flag de carregamento
          this.loading = false;
        }
      );
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  /**
   * solicita os dados
   */
  private loadData(): void {

    this._loadData(this.departmentService);

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(null, this.departmentService, null, this.ufList);

  }

  cancel() {}

}
