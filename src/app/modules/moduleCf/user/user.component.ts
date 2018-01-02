import { Component, OnInit, Injector } from '@angular/core';

import { CommonListComponent } from 'app/shared';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserDialogComponent } from './dialog/user-dialog.component';
import { ConfirmDialogComponent, confirmDialogModel } from 'app/shared';

@Component({
  selector: 'moduleCf-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends CommonListComponent implements OnInit {

  // lista de tipos de usuarios
  public typesList: Object;

  constructor(private userService: UserService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','user']);
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(5);
  }

  /**
   * faz o filtro de dados
   * @return {User[]} [description]
   */
  public listData(): User[] {

    // remove o admin
    let list;
    if ( this.list )
      list = this.list.filter( item => item.id !== 1 );

    return this._listData(list, this.filter, 'cpf', 'firstName', 'lastName', 'email', 'userTypeId:object');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {
    this.loading = true;
    // carrega categorias
    this.userService.loadUserTypes()
      .subscribe(
        types => {
          console.log('tipos', types);
          // converte para object
          let objTypes = {};
          for (let type of types) {
            objTypes[type.id] = type.description;
          }
          // perfil        filtro
          this.typesList = this.itemFilterList = objTypes;

          this._loadData(this.userService);

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
   * @param {User} data dados para o formulario
   */
  public showForm(data: User = null): void {
    // cria um novo objeto
    data = new User(data);
    data.typesList = this.typesList;

    this._showForm(UserDialogComponent, data);

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.userService);

  }

  /**
   * exibe dialog para resetar a senha
   * @param {string} cpf cpf do usuario
   */
  public resetPass(cpf:string): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: new confirmDialogModel({
        title: this.txt.modal.title.reset,
        text: this.txt.modal.messages.reset,
        buttonOk: this.txt.modal.buttons.confirm,
        buttonCancel: this.txt.modal.buttons.cancel
      })
    });
    // // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      // TODO
      if (result && result.choice == 'ok') {
        this.userService.resetPass(cpf)
          .subscribe(
            res => {
              // exibe mensagem de sucesso
              this.snackBar.open(this.txt.messages.reseted, 'Ok', {duration: 3000});
            },
            error => {
              console.error(error);
              // exibe mensagem de erro
              this.errorMsgLoading = this.txt.messages.error + ' - ' + error;
              this.loadData();
            }
          );
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });
  }
}
