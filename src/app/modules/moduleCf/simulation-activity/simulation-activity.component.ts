import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent, ConfirmDialogComponent } from 'app/shared';
import { SimulationActivity } from './simulation-activity.model';
import { SimulationActivityService } from './simulation-activity.service';
import { SimulationActivityDialogComponent } from './dialog/simulation-activity-dialog.component';

@Component({
  selector: 'moduleCf-simulation-activity',
  templateUrl: './simulation-activity.component.html',
  styleUrls: ['./simulation-activity.component.scss']
})
export class SimulationActivityComponent extends CommonListComponent implements OnInit {

  constructor(private simulationActivityService: SimulationActivityService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationActivity']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(11);
  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.simulationActivityService);

  }

  /**
   * faz o filtro de dados
   * @return {SimulationActivity[]} [description]
   */
  public listData(): SimulationActivity[] {

    return this._listData(this.list, this.filter, 'id', 'description');

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulationActivity} data dados para o formulario
   */
  public showForm(data: SimulationActivity = null): void {

    // cria um novo objeto
    data = new SimulationActivity(data);
    this._showForm(SimulationActivityDialogComponent, data);

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulationActivityService);

  }

}
