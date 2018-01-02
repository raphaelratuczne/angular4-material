import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { VehicleModel } from './vehicle-model.model';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModelDialogComponent } from './dialog/vehicle-model-dialog-component';

@Component({
  selector: 'moduleCf-model-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.scss']
})
export class VehicleModelComponent extends CommonListComponent implements OnInit {

  constructor(private vehicleModelService: VehicleModelService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','vehicleModel']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(7);
  }

  /**
   * faz o filtro de dados
   * @return {VehicleModel[]} [description]
   */
  public listData(): VehicleModel[] {

    return this._listData(this.list, this.filter, 'id', 'description', 'vehicleType.description');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.vehicleModelService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {VehicleModel} data dados para o formulario
   */
  public showForm(data: VehicleModel = null): void {

    this._showForm(VehicleModelDialogComponent, new VehicleModel(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.vehicleModelService);

  }

}
