import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent } from 'app/shared';
import { UserType } from './user-type.model';
import { UserTypeService } from './user-type.service';
import { UserTypeDialogComponent } from './dialog/user-type-dialog.component';

@Component({
  selector: 'moduleCf-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent extends CommonListComponent implements OnInit {

  constructor(private userTypeService: UserTypeService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','userType']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(4);
  }

  /**
   * faz o filtro de dados
   * @return {UserType[]} [description]
   */
  public listData(): UserType[] {

    let list;
    if ( this.list )
      list = this.list.filter( item => item.id != 1 );

    return this._listData(list, this.filter, 'description');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.userTypeService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {UserType} data dados para o formulario
   */
  public showForm(data: UserType = null): void {

    this._showForm(UserTypeDialogComponent, new UserType(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.userTypeService);

  }
}
