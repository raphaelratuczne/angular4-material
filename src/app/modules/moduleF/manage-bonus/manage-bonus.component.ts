import { Component, OnInit, Injector } from '@angular/core';
import { DateLocale } from 'md2';

import { CommonListComponent } from 'app/shared';
import { Bonus,
         BonusTypes,
         BonusService,
         BonusReverseDialogComponent } from '../bonus-entry';
import { DrivingSchool, DrivingSchoolService } from '../../moduleR/driving-school';

@Component({
  selector: 'moduleF-manage-bonus',
  templateUrl: './manage-bonus.component.html',
  styleUrls: ['./manage-bonus.component.scss']
})
export class ManageBonusComponent extends CommonListComponent implements OnInit {

  // lista de cfcs
  public cfcList: DrivingSchool[] = [];
  // id da cfc selecionada
  public idCFC: number;
  // data inicial (7 dias atras)
  public initialTimestamp: Date = new Date( new Date( (new Date()).getTime() - (1000 * 60 * 60 * 24 * 7) ) );
  // data final (1 hora afrente)
  public finalTimestamp: Date = new Date( new Date( (new Date()).getTime() + (1000 * 60 * 60) ) );
  // lista de erros
  public formErrors = {
    idCFC: [],
    initialTimestamp: [],
    finalTimestamp: []
  };
  // se foi enviado
  public sent: boolean = false;
  // tipos de bonus
  public bonusType = this.itemFilterList = BonusTypes;

  constructor(private bonusService: BonusService,
              private drivingSchoolService: DrivingSchoolService,
              private dateLocale: DateLocale,
              private injector:Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','manageBonus']);

    this.dateLocale.months = [
      { 'full': 'Janeiro', 'short': 'Jan' },
      { 'full': 'Fevereiro', 'short': 'Fev', },
      { 'full': 'Março', 'short': 'Mar' },
      { 'full': 'Abril', 'short': 'Abr' },
      { 'full': 'Maio', 'short': 'Mai' },
      { 'full': 'Junho', 'short': 'Jun' },
      { 'full': 'Julho', 'short': 'Jul' },
      { 'full': 'Agosto', 'short': 'Ago' },
      { 'full': 'Setembro', 'short': 'Set' },
      { 'full': 'Outubro', 'short': 'Out' },
      { 'full': 'Novembro', 'short': 'Nov' },
      { 'full': 'Dezembro', 'short': 'Dez' }
    ];
    this.dateLocale.days = [
        { full: 'Domingo', short: 'Dom', xshort: 'D' },
        { full: 'Segunda', short: 'Seg', xshort: 'S' },
        { full: 'Terça', short: 'Ter', xshort: 'T' },
        { full: 'Quarta', short: 'Qua', xshort: 'Q' },
        { full: 'Quinta', short: 'Qui', xshort: 'Q' },
        { full: 'Sexta', short: 'Sex', xshort: 'S' },
        { full: 'Sábado', short: 'Sab', xshort: 'S' },
    ];
  }

  ngOnInit() {
    // carrega os dados
    this.loadData();

    // pega as permissoes do usuario
    this._loadPermissions(27);
  }

  /**
   * faz o filtro de dados
   * @return {Bonus[]} [description]
   */
  public listData(): Bonus[] {

    return this._listData(this.list, this.filter, 'entryDate:datetime', 'type:objectRep', 'bonusValue', 'user.firstName', 'user.lastName');

  }

  /**
   * solicita os dados
   */
  public loadData(): void {
    this.loading = true;
    // carrega lista de CFCs
    this.drivingSchoolService.loadData()
      .subscribe(
        res => {
          this.cfcList = res;
          // flag de carregamento
          this.loading = false;
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
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {
    if ( this.sent ) {
      // valida campo cfc
      this.formErrors.idCFC = !this.idCFC ? [this.txt.fields.idCFC.errors.required] : [];

      // valida data inicial
      this.formErrors.initialTimestamp = !this.initialTimestamp ? [this.txt.fields.initialTimestamp.errors.required] : [];

      // valida data final
      this.formErrors.finalTimestamp = [];
      if ( !this.finalTimestamp )
        this.formErrors.finalTimestamp.push( this.txt.fields.finalTimestamp.errors.required );

      if ( (this.initialTimestamp && this.finalTimestamp) && (this.initialTimestamp > this.finalTimestamp) )
        this.formErrors.finalTimestamp.push( this.txt.fields.finalTimestamp.errors.bigger );
    }
  }

  public find(): void {
    this.sent = true;
    this.onChangeValues();
    // console.log(this.idCFC, this.initialTimestamp, this.finalTimestamp);
    if ( this.idCFC && (this.initialTimestamp < this.finalTimestamp) ) {
      this.loading = true;
      // carrega lista de bonus
      this.bonusService.loadData(this.idCFC, { initialTimestamp: this.initialTimestamp, finalTimestamp: this.finalTimestamp })
        .subscribe(
          res => {
            this.list = res;
            // console.log(this.list);
            // flag de carregamento
            this.loading = false;
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
  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Bonus} data dados para o formulario
   */
  public showForm(data: Bonus = null): void {

    // pega o id do cfc selecionado
    const cfcId = this.idCFC;
    // pega o nome do cfc selecionado
    data.drivingSchoolname = this.cfcList.find( cfc => cfc.id == cfcId ).company.name;

    let dialogRef = this.dialog.open(BonusReverseDialogComponent, {
      width: '600px',
      data: data
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // se clicou em ok
      if (result && result == 'saved') {
        // se salvou, carrega novamente a lista
        this.find();
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });

  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.bonusService);

  }

}
