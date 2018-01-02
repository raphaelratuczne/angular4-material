import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent, ConfirmDialogComponent } from 'app/shared';
import { SoftwareVersion } from './software-version.model';
import { SoftwareVersionService } from './software-version.service';
import { SoftwareVersionDialogComponent } from './dialog/software-version-dialog.component';

@Component({
  selector: 'moduleCf-software-version',
  templateUrl: './software-version.component.html',
  styleUrls: ['./software-version.component.scss'],
})
export class SoftwareVersionComponent extends CommonListComponent implements OnInit {

  constructor(private SoftwareVersionService: SoftwareVersionService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','softwareVersion']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(9);
  }

  /**
   * faz o filtro de dados
   * @return {SoftwareVersion[]} [description]
   */
  public listData(): SoftwareVersion[] {

    return this._listData(this.list, this.filter, 'version', 'description', 'releaseDate:date');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.SoftwareVersionService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SoftwareVersion} data dados para o formulario
   */
  public showForm(data: SoftwareVersion = null): void {

    this._showForm(SoftwareVersionDialogComponent, new SoftwareVersion(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.SoftwareVersionService);

  }

}
