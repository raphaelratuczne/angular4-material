import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { SimulatorHistory } from './simulator-history.model';
import { SimulatorHistoryService } from './simulator-history.service';
import { Simulators, SimulatorsService } from '../simulators';
import { SimulatorHistoryDialogComponent } from './dialog/simulator-history-dialog.component';

@Component({
  selector: 'moduleR-simulator-history',
  templateUrl: './simulator-history.component.html',
  styleUrls: ['./simulator-history.component.scss']
})
export class SimulatorHistoryComponent extends CommonListComponent implements OnInit {

  // lista de simuladores
  public simulatorsList: Simulators[] = [];
  // simulador selecionado
  public simulator: Simulators = null;

  constructor(private simulatorHistoryService: SimulatorHistoryService,
              private simulatorsService: SimulatorsService,
              private injector: Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','simulatorHistory']);
  }

  ngOnInit() {
    // carrega lista de simuladores
    this.simulatorsService.loadData()
      .subscribe(
        res => {
          this.simulatorsList = res;
          // console.log(this.simulatorsList);
          this.loading = false;
        },
        error => {
          console.error(error);
          // exibe mensagem de erro
          this.errorMsgLoading = this.txt.messages.error + ' - ' + error;
          // flag de carregamento
          this.loading = false;
        }
      )

    // pega as permissoes do usuario
    this._loadPermissions(16);
  }

  /**
   * faz o filtro de dados
   * @return {SimulatorHistory[]} [description]
   */
  public listData(): SimulatorHistory[] {

    return this._listData(this.list, this.filter, 'startDate:datetime', 'endDate:datetime', 'company.name');

  }

  selectSimulator(id:number): void {
    if ( !this.simulator || this.simulator.id != id ) {
      this.simulator = this.simulatorsList.find( sim => sim.id == id );
      this.loadData();
    }
  }

  public classSelected(id): boolean {
    return this.simulator && (this.simulator.id == id);
  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    const simulatorId = this.simulator ? this.simulator.id : null

    this._loadData(this.simulatorHistoryService, simulatorId);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulatorHistory} data dados para o formulario
   */
  public showForm(data: SimulatorHistory = null): void {

    this._showForm(SimulatorHistoryDialogComponent, new SimulatorHistory(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulatorHistoryService);

  }
}
