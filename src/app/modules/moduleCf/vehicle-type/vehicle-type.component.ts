import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { VehicleType } from './vehicle-type.model';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeDialogComponent } from './dialog/vehicle-type-dialog-component';

@Component({
  selector: 'moduleCf-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent extends CommonListComponent implements OnInit {

  constructor(private vehicleTypeService: VehicleTypeService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','vehicleType']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(6);
  }

  /**
   * faz o filtro de dados
   * @return {VehicleType[]} [description]
   */
  public listData(): VehicleType[] {

    return this._listData(this.list, this.filter, 'id', 'description');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.vehicleTypeService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {VehicleType} data dados para o formulario
   */
  public showForm(data: VehicleType = null): void {

    this._showForm(VehicleTypeDialogComponent, new VehicleType(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.vehicleTypeService);

  }
  
}
