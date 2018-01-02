import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { SharedUnit } from './shared-unit.model';
import { SharedUnitService } from './shared-unit.service';
import { SharedUnitDialogComponent } from './dialog/shared-unit-dialog.component';

@Component({
  selector: 'moduleR-shared-unit',
  templateUrl: './shared-unit.component.html',
  styleUrls: ['./shared-unit.component.scss']
})
export class SharedUnitComponent extends CommonListComponent implements OnInit {

  constructor(private sharedUnitService: SharedUnitService,
              private injector: Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','sharedUnit']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(20);
  }

  /**
   * faz o filtro de dados
   * @return {SharedUnit[]} [description]
   */
  public listData(): SharedUnit[] {

    return this._listData(this.list, this.filter, 'company.name', 'company.address.street', 'company.address.number', 'company.address.cityArea', 'company.address.city.name');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.sharedUnitService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SharedUnit} data dados para o formulario
   */
  public showForm(data: SharedUnit = null): void {

    this._showForm(SharedUnitDialogComponent, new SharedUnit(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.sharedUnitService);

  }
}
