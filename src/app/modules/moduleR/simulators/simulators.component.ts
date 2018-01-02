import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { Simulators } from './simulators.model';
import { SimulatorsDialogComponent } from './dialog/simulators-dialog.component';
import { SimulatorsService } from './simulators.service';

@Component({
  selector: 'moduleR-simulators',
  templateUrl: './simulators.component.html',
  styleUrls: ['./simulators.component.scss']
})
export class SimulatorsComponent extends CommonListComponent implements OnInit {

  constructor(private simulatorsService: SimulatorsService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','simulators']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(15);
  }

  /**
   * faz o filtro de dados
   * @return {Simulators[]} [description]
   */
  public listData(): Simulators[] {

    return this._listData(this.list, this.filter, 'name', 'serialNumber', 'vehicleType.description');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.simulatorsService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Simulators} data dados para o formulario
   */
  public showForm(data: Simulators = null): void {

    this._showForm(SimulatorsDialogComponent, new Simulators(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulatorsService);

  }
}
