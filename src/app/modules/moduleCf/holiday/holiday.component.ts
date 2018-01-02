import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent } from 'app/shared';
import { Holiday } from './holiday.model';
import { HolidayService } from './holiday.service';
import { HolidayDialogComponent } from './dialog/holiday-dialog.component';

@Component({
  selector: 'moduleCf-model-model',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent extends CommonListComponent implements OnInit {

  // lista de tipos de feriados
  public typesList: Object;
  // filtro2
  public filter2:string;

  constructor(private holidayService: HolidayService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','holiday']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(6);
  }

  /**
   * faz o filtro de dados para feriados variaveis
   * @return {Holiday[]} [description]
   */
  public listData(): Holiday[] {

    const list = this._listData(this.list, this.filter, 'holidayDate:date', 'description');
    return list ? list.filter( item => item.type === 1 ) : list;

  }

  /**
   * faz o filtro de dados para feriados fixos
   * @return {Holiday[]} [description]
   */
  public listData2(): Holiday[] {

    const list = this._listData(this.list, this.filter2, 'holidayDate:date', 'description');
    return list ? list.filter( item => item.type === 0 ) : list;

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this.loading = true;
    // carrega tipos de feriados
    this.holidayService.loadTypes()
      .subscribe(
        cats => {
          // tipos de feriados         filtro
          this.typesList = this.itemFilterList = cats;
          // carrega a lista
          this._loadData(this.holidayService);
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
   * @param {Holiday} data dados para o formulario
   */
  public showForm(data: Holiday = null): void {

    // cria um novo objeto
    data = new Holiday(data);
    data.typesList = this.typesList;

    this._showForm(HolidayDialogComponent, data);

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.holidayService);

  }

}
