import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { DrivingSchool } from './driving-school.model';
import { DrivingSchoolService } from './driving-school.service';
import { DrivingSchoolDialogComponent } from './dialog/driving-school-dialog.component';

@Component({
  selector: 'moduleR-driving-school',
  templateUrl: './driving-school.component.html',
  styleUrls: ['./driving-school.component.scss']
})
export class DrivingSchoolComponent extends CommonListComponent implements OnInit {

  constructor(private drivingSchoolService: DrivingSchoolService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleR','drivingSchool']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(19);
  }

  /**
   * faz o filtro de dados
   * @return {DrivingSchool[]} [description]
   */
  public listData(): DrivingSchool[] {

    return this._listData(this.list, this.filter, 'company.name', 'company.address.street', 'company.address.number', 'company.address.cityArea', 'company.address.city.name');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.drivingSchoolService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {DrivingSchool} data dados para o formulario
   */
  public showForm(data: DrivingSchool = null): void {

    this._showForm(DrivingSchoolDialogComponent, new DrivingSchool(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.drivingSchoolService);

  }
}
