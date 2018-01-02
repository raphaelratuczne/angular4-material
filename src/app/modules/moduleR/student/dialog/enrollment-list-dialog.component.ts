import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar, MdDialog } from '@angular/material';

import { CommonListComponent, confirmDialogModel, ConfirmDialogComponent } from 'app/shared';
import { Student } from '../student.model';
import { Enrollment } from '../../../moduleA/enrollment/enrollment.model';
import { EnrollmentService } from '../../../moduleA/enrollment/enrollment.service';

@Component({
  templateUrl: 'enrollment-list-dialog.component.html',
})
export class EnrollmentListDialogComponent extends CommonListComponent implements OnInit, OnDestroy {

  public errorMsgSent:string;
  // lista de matriculas
  public enrollments: Enrollment[] = [];

  constructor(@Inject(MD_DIALOG_DATA) public data: Student,
              private dialogRef: MdDialogRef<EnrollmentListDialogComponent>,
              private enrollmentService: EnrollmentService,
              // private dialog: MdDialog,
              private injector:Injector) {
    //                modulo         pagina
    super(injector, ['moduleR','student']);
  }

  ngOnInit() {
    // carrega a lista de matriculas do usuario
    this.enrollmentService.loadData(this.data.id)
      .subscribe( res => this.enrollments = res );
    // pega as permissoes do usuario
    this._loadPermissions(17);
  }

  ngOnDestroy() {}

  /**
   * retorna lista de matriculas do aluno
   * @return {Enrollment[]}
   */
  public listData(): Enrollment[] {
    return this.enrollments;
  }

  public loadData() {}

  /**
   * cancela matricula
   * @param {Enrollment} enrollment dados da matricula
   */
  public cancelEnrollment(enrollment:Enrollment): void {

    if (enrollment.status === 4)
      return;

    // termos para substituir
    const terms = /{enrollment}|{student}|{date}|{hour}|{temp}/g;
    // funcao para substituir termos
    const replaceTerms = term => {
      switch(term) {
        case '{enrollment}':
          return enrollment.id;
          // break;
        case '{student}':
          return `${enrollment.user.firstName} ${enrollment.user.lastName}`;
          // break;
        case '{date}':
          return (new Date(enrollment.enrollmentDate as string).toISOString()).replace(/^([\d]{4})(\-)([\d]{2})(\-)([\d]{2})(.*)$/, '$5/$3/$1');
          // break;
        case '{hour}':
          return (new Date(enrollment.enrollmentDate as string).toISOString()).replace(/^([\d|\-]*)(T{1})([\d]{2}:[\d]{2}:[\d]{2})(.*)$/, '$3');
          // break;
        case '{temp}':
          return enrollment.numLessonsLoaded;
          // break;
      }
    };
    // mensagem
    let msg: string;

    // exibe uma janela de confirmacao de acordo com o tipo de aula
    switch( enrollment.lessonsType ) {
      case 0: // Aulas Detran
        msg = this.txt.modal.messages.cancelDetran.replace(terms, replaceTerms);
        break;
      case 1:
        msg = this.txt.modal.messages.cancelSingleClass.replace(terms, replaceTerms);
        break;
      case 2:
        msg = this.txt.modal.messages.cancelFreeClass.replace(terms, replaceTerms);
        break;
    }

    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: new confirmDialogModel({
        title: this.txt.modal.title.cancel,
        text: msg,
        buttonOk: this.txt.modal.buttons.confirm,
        buttonCancel: this.txt.modal.buttons.cancel
      })
    });
    // // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      if (result && result.choice == 'ok') {
        // cancela o contrato
        this.enrollmentService.deleteData(enrollment.id)
          .subscribe(
            res => {
              // exibe mensagem de sucesso
              this.snackBar.open(this.txt.messages.canceled, 'Ok', {duration: 2000});
              // atualiza o status do item manualmente
              enrollment.status = 4;
            },
            error => {
              // exibe mensagem de sucesso
              this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
            }
          );
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });

  }

  /**
   * fecha o dialog
   * @param {MouseEvent} event
   */
  public cancel(event: MouseEvent): void {
    event.preventDefault();
    this.dialogRef.close('cancel');
  }
}
