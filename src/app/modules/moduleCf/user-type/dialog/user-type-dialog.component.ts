import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { AuthUser, CommonFormComponent } from 'app/shared';
import { UserType } from '../user-type.model';
import { UserTypeService } from '../user-type.service';

@Component({
  templateUrl: 'user-type-dialog.component.html',
})
export class UserTypeDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // id da empresa
  private companyId: number = null;
  // permissoes
  public authUser: AuthUser;

  constructor(@Inject(MD_DIALOG_DATA) public data: UserType,
              private dialogRef: MdDialogRef<UserTypeDialogComponent>,
              private userTypeService: UserTypeService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','userType']);

    // pega o id da empresa
    this.companyId = this.authService.getSelectedCompany().id;
    // pega as permissoes do usuario
    this.authService.getAuthUser()
      .subscribe( au => this.authUser = au );

  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      description: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
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
    // cria o objeto de formulario
    this.form = this.formBuilder.group({
      id: this.data.id,
      description: [
        {value: this.data.description, disabled: false},
        [Validators.required, Validators.maxLength(30)]],
      permissions: this.formBuilder.array([])
    });
    this.data.permissions = this.data.permissions != null ? this.data.permissions : this.authUser.userType.permissions;
    // objeto de lista de permissoes
    const permissionsFGs = this.data.permissions
      // transforma em formBuilder group
      .map( permission => {
        return this.formBuilder.group({
          id: this.data.id ? permission.id : 0,
          authCreate: this.data.id ? permission.authCreate : false,
          authDelete: this.data.id ? permission.authDelete : false,
          authRead:   this.data.id ? permission.authRead : false,
          authUpdate: this.data.id ? permission.authUpdate : false,
          feature: this.formBuilder.group({
            id:                   permission.feature.id,
            enabledInAdminArea:   permission.feature.enabledInAdminArea,
            enabledInSchoolArea:  permission.feature.enabledInSchoolArea,
            description:          permission.feature.description,
            role:                 permission.feature.role
          })
        })
    } );
    // array com permissions formBuilder
    const permissionsFA = this.formBuilder.array(permissionsFGs);
    // adiciona ao formulario
    this.form.setControl('permissions', permissionsFA);

    // observa as mudancas
    this._afterBuildForm();
  }

  public showAdmin(area:boolean): boolean {
    return this.companyId == 0 && area;
  }

  public showSchool(area:boolean): boolean {
    return this.companyId != 0 && area;
  }

  /**
   * get de permissoes
   * @return {FormArray}
   */
  public get permissions(): FormArray {
    return this.form.get('permissions') as FormArray;
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

    this._send(this.data.id, this.userTypeService, this.dialogRef);

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
