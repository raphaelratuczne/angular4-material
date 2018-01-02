import { Component, OnInit, Injector } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent, ConfirmDialogComponent } from 'app/shared';
import { SimulationModule } from './simulation-module.model';
import { SimulationModuleService } from './simulation-module.service';
import { SimulationModuleDialogComponent } from './dialog/simulation-module-dialog.component';
import { SimulationModuleCloneDialogComponent } from './dialog/simulation-module-clone-dialog.component';

@Component({
  selector: 'moduleCf-simulation-module',
  templateUrl: './simulation-module.component.html',
  styleUrls: ['./simulation-module.component.scss']
})
export class SimulationModuleComponent extends CommonListComponent implements OnInit {

  constructor(private simulationModuleService: SimulationModuleService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationModule']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(14);
  }

  /**
   * faz o filtro de dados
   * @return {SimulationModule[]} [description]
   */
  public listData(): SimulationModule[] {

    return this._listData(this.list, this.filter, 'softwareVersion.version', 'description');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.simulationModuleService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulationModule} data dados para o formulario
   */
  public showForm(data: SimulationModule = null): void {

    this._showForm(SimulationModuleDialogComponent, new SimulationModule(data));

  }

  /**
   * exibe janela para clonar
   */
  public showFormClone(): void {
    let dialogRef = this.dialog.open(SimulationModuleCloneDialogComponent, {
      width: '400px',
      data: 'teste'
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      if (result && result == 'saved') {
        // se salvou, carrega novamente a lista
        this.loadData();
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });
  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulationModuleService);

  }
}
