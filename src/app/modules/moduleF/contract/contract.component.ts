import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent,
         ConfirmDialogComponent,
         confirmDialogModel } from 'app/shared';
import { Contract } from './contract.model';
import { ContractService } from './contract.service';
import { ContractDialogComponent } from './dialog/contract-dialog.component';
import { DrivingSchool, DrivingSchoolService } from '../../moduleR/driving-school';

@Component({
  selector: 'moduleF-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent extends CommonListComponent implements OnInit {

  // lista de cfcs
  public cfcList: DrivingSchool[] = [];
  // cfc selecionado
  public cfc: DrivingSchool;

  constructor(private contractService: ContractService,
              private drivingSchoolService: DrivingSchoolService,
              private injector: Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','contract']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(23);
  }

  /**
   * faz o filtro de dados
   * @return {Contract[]} [description]
   */
  public listData(): Contract[] {

    let list = this._listData(this.list, this.filter, 'startDate:date', 'endDate:date', 'lessonPrice');

    if ( this.cfc && list ) {
      // filtra pelo cfc selecionado
      return list.filter( item => item.drivingSchool.id == this.cfc.id );
    } else {
      return [];
    }

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    // carrega lista de CFCs
    this.drivingSchoolService.loadData()
      .subscribe(
        res => {
          this.cfcList = res;

          this._loadData(this.contractService);
        }
      );

  }

  selectCfc(id:number): void {
    if ( !this.cfc || this.cfc.id != id ) {
      this.cfc = this.cfcList.find( cfc => cfc.id == id );
      // this.loadData();
    }
  }

  public classSelected(id): boolean {
    return this.cfc && (this.cfc.id == id);
  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Contract} data dados para o formulario
   */
  public showForm(data: Contract = new Contract(null)): void {

    this._showForm(ContractDialogComponent, data);

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.contractService);

  }

}
