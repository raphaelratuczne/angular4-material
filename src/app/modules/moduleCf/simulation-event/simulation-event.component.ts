import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent, ConfirmDialogComponent } from 'app/shared';
import { SimulationEvent } from './simulation-event.model';
import { SimulationEventService } from './simulation-event.service';
import { SimulationEventDialogComponent } from './dialog/simulation-event-dialog.component';

@Component({
  selector: 'moduleCf-simulation-event',
  templateUrl: './simulation-event.component.html',
  styleUrls: ['./simulation-event.component.scss']
})
export class SimulationEventComponent extends CommonListComponent implements OnInit {

  // lista de categorias
  public categoriesList: Object;

  constructor(private simulationEventService: SimulationEventService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationEvent']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(11);
  }

  /**
   * faz o filtro de dados
   * @return {SimulationEvent[]} [description]
   */
  public listData(): SimulationEvent[] {

    return this._listData(this.list, this.filter, 'id', 'description', 'category:object');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this.loading = true;
    // carrega categorias
    this.simulationEventService.loadCategories()
      .subscribe(
        cats => {
          // categorias         filtro
          this.categoriesList = this.itemFilterList = cats;
          // carrega a lista
          this._loadData(this.simulationEventService);
        },
        error => {
          console.error(error);
          // exibe mensagem de erro
          this.errorMsgLoading = this.txt.messages.error + ' - ' + error;
          // flag de carregamento
          this.loading = false;
        }
      );

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulationEvent} data dados para o formulario
   */
  public showForm(data: SimulationEvent = null): void {

    // cria um novo objeto
    data = new SimulationEvent(data);
    data.categoriesList = this.categoriesList;

    this._showForm(SimulationEventDialogComponent, data);

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulationEventService);

  }
  
}
