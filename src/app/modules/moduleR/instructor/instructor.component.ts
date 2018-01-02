import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { Instructor } from './instructor.model';
import { InstructorService } from './instructor.service';
import { InstructorDialogComponent } from './dialog/instructor-dialog.component';

@Component({
  selector: 'moduleR-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent extends CommonListComponent implements OnInit {

  constructor(private instructorService: InstructorService,
              private injector:Injector) {
    //                modulo         pagina
    super(injector, ['moduleR','instructor']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(18);
  }

  /**
   * faz o filtro de dados
   * @return {Instructor[]} [description]
   */
  public listData(): Instructor[] {

    return this._listData(this.list, this.filter, 'person.name', 'person.cpf', 'person.birthDate:date');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.instructorService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Instructor} data dados para o formulario
   */
  public showForm(data: Instructor = null): void {

    this._showForm(InstructorDialogComponent, new Instructor(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.instructorService);

  }

}
