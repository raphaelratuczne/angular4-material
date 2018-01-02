import { Injector } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
// import { Subscription } from 'rxjs/Rx';

import { texts } from '../mockdata/texts';
import { getKeyByValue } from '../functions/getKeyByValue';
import { numberToMoney } from '../functions/number-to-money';
import { removeAccents } from '../functions/remove-accents';
import { AuthService } from '../services/auth/auth.service';
import { Permission } from '../services/auth/auth.model';
import { confirmDialogModel, ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { CommonService } from './common.service';
import { CommonDialogFormComponent } from './common-dialog-form.component';

export abstract class CommonListComponent {

  protected authService: AuthService;
  protected snackBar: MdSnackBar;
  protected dialog: MdDialog;

  // textos do layout
  public txt;
  // lista de dados
  public list: Array<any>;
  // filtro de lista
  public filter: string;
  // itens usados em alguns filtros
  public itemFilterList: Object;
  // se esta carregando/enviando
  public loading: boolean = true;
  // mensagem de erro de servico ao carregar
  public errorMsgLoading: string;
  // // permissoes
  public permission: Permission;

  /**
   * funcao constructor
   * @param  {[string,string]} txt textos da pagina (modulo,pagina)
   */
  constructor(injector:Injector, t:[string,string]) {
    this.authService = injector.get(AuthService);
    this.snackBar = injector.get(MdSnackBar);
    this.dialog = injector.get(MdDialog);

    // carrega os textos
    this.txt = texts[t[0]][t[1]];
  }

  /**
 * carrega as permissoes da pagina
 * @param {number} id id da pagina
 */
  protected _loadPermissions(id:number): void {
    // pega as permissoes do usuario
    this.authService.getAuthUserPage(id)
      .subscribe( p => this.permission = p );
  }

  /**
   * funcao base para filtrar lista de dados
   * @return {Array<any>} lista de dados
   */
  abstract listData(): Array<any>;

  /**
   * filtra a lista de dados
   * @param  {any[]}    arr       lista de dados
   * @param  {string}   filter    filtro
   * @param  {string[]} fields    campos do filtro
   * @return {any[]}              lista de dados filtrados
   */
  protected _listData(arr:any[], filter:string, ...fields:string[]): any[] {
    if ( arr === undefined || arr === null || arr.length === 0 || filter === undefined || filter.trim() === '' )
      return arr;

    // passa um filtro
    return arr.filter( arrValue => {
      // lista de resultados por campo
      let objResult: Array<boolean> = [];
      // faz um loop nos campos
      fields.forEach( fieldValue => {
        // variavel para guardar o valor
        let value:any = null;
        // tipo de valor
        let type:string = null;
        // verifica se passou o tipo do campo
        if ( fieldValue.indexOf(':') != -1 ) {
          // separa campo e tipo
          [ fieldValue, type ] = fieldValue.split(':');
        }
        // pega o valor
        // verifica se passou um sub campo
        value = fieldValue.indexOf('.') != -1 ? eval('arrValue.' + fieldValue ) : arrValue[fieldValue];

        // trata pelo tipo
        // campo tipo data
        if ( type && type == 'date' && value != null ) {
          // verifica se o filtro esta no campo
          objResult.push( String( value['toLocaleDateString']() ).toLowerCase().indexOf(filter.toLowerCase()) >= 0 );
        }
        // campo tipo data e hora
        if ( type && type == 'datetime' && value != null ) {
          // verifica se o filtro esta no campo
          objResult.push( String(value['toLocaleString']()).slice(0,-3).toLowerCase().indexOf(filter.toLowerCase()) >= 0 );
        }
        // busca em um objeto
        if ( type && type == 'object' && this.itemFilterList ) {
          // retorna a chave pelo valor passado
          objResult.push( +value == getKeyByValue(this.itemFilterList, filter) );
        }
        // busa em um objeto onde o valor pode se repetir
        if ( type && type == 'objectRep' && this.itemFilterList ) {
          let arrC: Array<any> = [];
          // busta todas as chaves dos valores que condizem
          for ( let i in this.itemFilterList ) {
            if ( removeAccents( this.itemFilterList[i] ).toLowerCase().indexOf(removeAccents(filter).toLowerCase()) >= 0 )
              arrC.push(i);
          }
          // verifica se um dos resultados é o valor
          objResult.push( arrC.some( arrCValue => String(arrCValue) === String(value)) );
        }
        // campo tipo dinheiro
        if ( type && type == 'money' ) {
          // verifica se o filtro esta no campo
          objResult.push( String(numberToMoney(value)).toLowerCase().indexOf(filter.toLowerCase()) >= 0 );
        }
        // se nao passou um tipo
        if ( !type )
          objResult.push( removeAccents( String(value) ).toLowerCase().indexOf(removeAccents(filter).toLowerCase()) >= 0 );

      } );
      // retorna se encontrou alguma coisa
      return objResult.some( objResValue => objResValue === true );
    } );
  }

  /**
   * funcao base para carregar lista de dados
   */
  abstract loadData(): void;

  /**
   * solicita os dados
   * @param {CommonService} service instancia do servico
   * @param {any}           data    dados adicionais a serem passados
   */
  protected _loadData(service:CommonService, ...data): void {
    this.loading = true;
    // carrega a lista
    service.loadData(...data)
      .subscribe(
        res => {
          // flag de carregamento
          this.loading = false;
          this.list = res;
          // console.log(this.list);
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
   * exibe o formulario
   * @param {ComponentType}     component       instancia do componente de dialog
   * @param {any}               data            dados para enviar ao dialog
   * @param {string}            width           largura do dialog (com 'px' no valor)
   * @param {Function}          callbackSaved   funcao callback ao clicar em salvar
   * @param {Function}          callbackCancel  funcao callback ao clicar em cancelar
   * @param {Function|boolean}  callbackClose   funcao callback ao clicar fechar a janela clicando fora dela, se passado como true, executa a mesma funcao setada em callbackCancel
   */
  protected _showForm(component, data: any = null, width?:string, callbackSaved?:Function, callbackCancel?:Function, callbackClose:Function|boolean = false): void {

    let dialogRef = this.dialog.open(component, {
      width: width || '600px',
      data: data
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      if (result && result == 'saved') {
        // se salvou, carrega novamente a lista
        this.loadData();
        // se passou uma funcao de callback
        if ( typeof callbackSaved == 'function' ) {
          callbackSaved();
        }
      }
      // se passou uma funcao de callback para executar ao clicar em cancelar
      if (result && result == 'cancel' && typeof callbackCancel == 'function' ) {
        callbackCancel();
      }
      // se passou uma funcao de callback para executar ao clicar fora da janela
      if ( !result && typeof callbackClose == 'function' ) {
        callbackClose();
      }
      // se no lugar de callbackClose passou true como valor, executa callbackCancel ao clicar fora da janela
      if ( !result && typeof callbackClose == 'boolean' && callbackClose && typeof callbackCancel == 'function' ) {
        callbackCancel();
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });
  }

  /**
   * exclui um item
   * @param {number}        id      id do item
   * @param {CommonService} service instancia do servico
   */
  protected _delete(id:number, service:CommonService): void {

    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: new confirmDialogModel({
        title: this.txt.modal.title.delete || this.txt.modal.title,
        text: this.txt.modal.messages.delete || this.txt.modal.messages,
        buttonOk: this.txt.modal.buttons.ok,
        buttonCancel: this.txt.modal.buttons.cancel
      })
    });
    // // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // se clicou em ok
      if (result && result.choice == 'ok') {
        service.deleteData(id)
          .subscribe(
            res => {
              // exibe mensagem de sucesso
              this.snackBar.open(this.txt.messages.deleted, 'Ok', {duration: 2000});
              // se excluiu, carrega novamente a lista
              this.loadData();
            },
            error => {
              console.error(error);
              // se o erro for 404, não exibe mensagem
              if ( error.substr(0,3) !== '404' ) {
                // se for erro por item que não pode ser excluido
                if ( error.indexOf('ConstraintViolationException') !== -1 ) {
                  // exibe mensagem de erro por conter vinculos
                  this.dialog.open(ConfirmDialogComponent, {
                    width: '400px',
                    data: new confirmDialogModel({
                      text: this.txt.messages.notDeleted,
                      buttonCancel: this.txt.modal.buttons.close
                    })
                  });
                // se for erro 403, exibe a msg q retornou
                } else if ( error.substr(0,3) === '403' ) {
                  // remove codigos da msg e exibe ela
                  const msg = error.replace('403 - OK Forbidden ', '');
                  this.dialog.open(ConfirmDialogComponent, {
                    width: '400px',
                    data: new confirmDialogModel({
                      text: msg,
                      buttonCancel: this.txt.modal.buttons.close
                    })
                  });
                } else {
                  // exibe mensagem de erro
                  // this.errorMsgLoading = this.txt.messages.error + ' - ' + error;
                  // exibe mensagem de erro em uma janela
                  this.dialog.open(ConfirmDialogComponent, {
                    width: '400px',
                    data: new confirmDialogModel({
                      text: error,
                      buttonCancel: this.txt.modal.buttons.close
                    })
                  });
                }
              }
              this.loadData();
            }
          );
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });
  }

}
