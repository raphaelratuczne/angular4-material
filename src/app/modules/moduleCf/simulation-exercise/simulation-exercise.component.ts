import { Component, OnInit, Injector } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent, ConfirmDialogComponent } from 'app/shared';
import { SimulationExercise } from './simulation-exercise.model';
import { SimulationExerciseService } from './simulation-exercise.service';
import { SimulationExerciseDialogComponent } from './dialog/simulation-exercise-dialog.component';
import { SimulationExerciseCloneDialogComponent } from './dialog/simulation-exercise-clone-dialog.component';

@Component({
  selector: 'moduleCf-simulation-exercise',
  templateUrl: './simulation-exercise.component.html',
  styleUrls: ['./simulation-exercise.component.scss']
})
export class SimulationExerciseComponent extends CommonListComponent implements OnInit {

  constructor(private simulationExerciseService: SimulationExerciseService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','simulationExercise']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(13);
  }

  /**
   * faz o filtro de dados
   * @return {SimulationExercise[]} [description]
   */
  public listData(): SimulationExercise[] {

    return this._listData(this.list, this.filter, 'code', 'description', 'softwareVersion.version');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.simulationExerciseService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulationExercise} data dados para o formulario
   */
  public showForm(data: SimulationExercise = null): void {

    this._showForm(SimulationExerciseDialogComponent, new SimulationExercise(data));

  }


  public showFormClone(): void {
    let dialogRef = this.dialog.open(SimulationExerciseCloneDialogComponent, {
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

    this._delete(id, this.simulationExerciseService);

  }
}
