import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { StudentDialogComponent } from './dialog/student-dialog.component';
import { EnrollmentDialogComponent } from './dialog/enrollment-dialog.component';
import { EnrollmentListDialogComponent } from './dialog/enrollment-list-dialog.component';

@Component({
  selector: 'moduleR-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent extends CommonListComponent implements OnInit {

  constructor(private studentService: StudentService,
              private injector:Injector) {
    //                modulo         pagina
    super(injector, ['moduleR','student']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(17);
  }

  /**
   * faz o filtro de dados
   * @return {Student[]} [description]
   */
  public listData(): Student[] {

    return this._listData(this.list, this.filter, 'person.name', 'person.cpf', 'person.birthDate:date');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.studentService);

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Student} data dados para o formulario
   */
  public showForm(data: Student = null): void {

    this._showForm(StudentDialogComponent, new Student(data));

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.studentService);

  }

  showFormNewEnrollment(student:Student): void {

    this._showForm(EnrollmentDialogComponent, new Student(student));

  }

  showEnrollmentsList(student:Student): void {

    this._showForm(EnrollmentListDialogComponent, student, '700px');

  }
}
