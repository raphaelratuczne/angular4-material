import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { Infraction } from './infraction.model';
import { InfractionService } from './infraction.service';
import { InfractionDialogComponent } from './dialog/infraction-dialog.component';

@Component({
  selector: 'configuraction-infraction',
  templateUrl: './infraction.component.html',
  styleUrls: ['./infraction.component.scss']
})
export class InfractionComponent extends CommonListComponent implements OnInit {

  constructor(private infractionService: InfractionService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','infraction']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(10);
  }

  /**
   * faz o filtro de dados
   * @return {Infraction[]} [description]
   */
  public listData(): Infraction[] {

    return this._listData(this.list, this.filter, 'code', 'article', 'law');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.infractionService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Infraction} data dados para o formulario
   */
  public showForm(data: Infraction = null): void {

    this._showForm(InfractionDialogComponent, new Infraction(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.infractionService);

  }
}
