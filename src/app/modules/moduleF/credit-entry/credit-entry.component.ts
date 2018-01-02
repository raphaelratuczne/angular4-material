import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { MdSnackBar, MdDialog } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { CommonFormComponent,
         confirmDialogModel,
         ConfirmDialogComponent,
         moneyToNumber } from 'app/shared';
import { Credit, CreditTypes } from './credit.model';
import { CreditService } from './credit.service';
import { CreditReverseDialogComponent } from './dialog/credit-reverse-dialog.component';
import { DrivingSchool, DrivingSchoolService } from '../../moduleR/driving-school';
import { SystemService } from '../../moduleCf/system';

@Component({
  selector: 'moduleF-credit-entry',
  templateUrl: './credit-entry.component.html',
  styleUrls: ['./credit-entry.component.scss']
})
export class CreditEntryComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de cfcs
  public cfcList: DrivingSchool[] = [];
  // mascara de numeros
  public qtMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];
  // lista de creditos
  public creditList: Credit[] = [];
  // tipos de bonus
  public creditType = CreditTypes;
  // mascara de moeda
  public numberMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    integerLimit: 11,
    requireDecimal: true
  });

  public imagem: any;
  public hasBaseDropZoneOver:boolean = false;
  // public hasAnotherDropZoneOver:boolean = false;
  // referencia ao uploader
  public uploader:FileUploader;
  // tamanho maximo do arquivo
  private maxFileSize: number;
  // mensagem de erro do arquivo
  public msgErrorFile: string;
  // flag enviando arquivos
  private sendingFiles:boolean;
  // referencia a funcao
  public moneyToNumber = moneyToNumber;

  constructor(private creditService: CreditService,
              private drivingSchoolService: DrivingSchoolService,
              private systemService: SystemService,
              private dialog: MdDialog,
              private injector:Injector) {
    //                modulo      pagina
    super(injector, ['moduleF','creditEntry']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      drivingSchoolId: [],
      creditValue: [],
      justification: [],
      evidences: []
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      drivingSchoolId: {
        required: this.txt.fields.drivingSchoolId.errors.required,
      },
      creditValue: {
        required: this.txt.fields.creditValue.errors.required,
        maxlength: this.txt.fields.creditValue.errors.maxlength,
      },
      justification: {
        required: this.txt.fields.justification.errors.required,
        maxlength: this.txt.fields.justification.errors.maxlength,
      },
      evidences: {
        required: this.txt.fields.evidences.errors.required
      }
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(24);

    this.uploader = new FileUploader({ url: this.creditService.getUrlUploadImages() });
    // this.uploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });

  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.cancelListenners();
  }

  /**
   * cria o formulario
   */
  public buildForm(): void {
    this.form = this.formBuilder.group({
      drivingSchoolId: [
        {value: null, disabled: true},
        Validators.required],
      creditValue: [
        {value: null, disabled: false},
        [Validators.required, Validators.maxLength(17)]],
      justification: [
        {value: null, disabled: false},
        [Validators.required, Validators.maxLength(500)]],
      evidences: this.formBuilder.array([])
    });

    // observa as mudancas
    this._afterBuildForm();

    // carrega os dados
    this.loadData();

  }

  /**
   * get de evidences
   * @return {FormArray}
   */
  public get evidences(): FormArray {
    return this.form.get('evidences') as FormArray;
  }

  /**
   * adiciona zeros no final do campo de dinheiro
   */
  public changeSufix(): void {

    // verifica se tem os zeros no final do valor
    let creditValue = this.form.get('creditValue').value;

    if ( creditValue ) {
      if ( creditValue.substr(-1) == ',' )
        creditValue += '00';
      else if ( creditValue.substr(-2,1) == ',' )
        creditValue += '0';
      else if ( creditValue.substr(-3,1) != ',' )
        creditValue += ',00';

      // se o campo passou do limite
      if ( creditValue.length > 17 ) {
        // remove primeiro numero
        creditValue = creditValue.replace(/^(R\$\s)(\d\.)(.*)$/, '$1$3');
      }

      this.form.get('creditValue').setValue( creditValue );
    }

    this.onChangeValues();

  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    // verifica se adicionou pelo menos 1 arquivo
    if ( this.sent && this.uploader && this.uploader.queue.length < 1 )
      this.form.get('evidences').setErrors({required:true});
    else
      this.form.get('evidences').setErrors(null);

    this._onChangeValues();
    // console.log(this.formErrors);

  }


  /**
   * solicita os dados
   */
  private loadData(): void {

    // carrega lista de CFCs
    this.drivingSchoolService.loadData()
      .subscribe(
        res => {
          this.cfcList = res;
          this.form.get('drivingSchoolId').enable();
          // seleciona o 1º cfc e carrega os dados
          if ( this.cfcList.length > 0 ) {
            this.form.get('drivingSchoolId').setValue( this.cfcList[0].id );
            this.onChooseCfc( this.cfcList[0].id );
          }

          // carrega dados de configuração de sistema
          this.systemService.loadData()
            .subscribe(
              resSys => {
                // pega tamanho maximo de anexo
                this.maxFileSize = resSys.maxSizeAttachment;
                // console.log(resSys);
              }
            );
        }
      );

  }

  public onChooseCfc(dsId:number): void {
    // flag de carregamento
    this.loading = true;
    this.creditService.loadData(dsId, {last:5})
      .subscribe(
        res => {
          // console.log('creditos->', res);
          // flag de carregamento
          this.loading = false;

          this.creditList = res;
        },
        error => {
          console.error(error);
          // se o erro for 404, não exibe mensagem
          if ( error.substr(0,3) !== '404' ) {
            // exibe mensagem de erro
            this.errorMsgLoading = this.txt.messages.error + error;
          }
          // flag de carregamento
          this.loading = false;
        }
      );

  }


  public fileOverBase(e:any):void {
    // console.log('arquivo adicionado', e);
    this.hasBaseDropZoneOver = e;
    // tipos de arquivos permitidos
    const fileTypes = [
      'image/jpeg', // jpg|jpeg
      'image/png',
      'image/bmp',
      'application/pdf',
      'text/plain', // txt
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-excel' // xls, xlt
    ];

    if (!e) {
      console.log(this.uploader);
      // faz um loop pelos arquivos adicionados
      for (let i in this.uploader.queue) {
        // verifica o tamanho do arquivo
        if ( (this.uploader.queue[i].file.size / 1024 / 1024) > this.maxFileSize ) {
          // remove o arquivo
          this.uploader.queue[i].remove();
          // alerta sobre o tamanho permitido
          this.msgErrorFile = this.txt.fields.evidences.errors.maxSize.replace('{size}', this.maxFileSize);
          setTimeout(() => this.msgErrorFile = null, 5000);
        }
        // verifica tipo de arquivo
        else if ( !fileTypes.some( type => type == this.uploader.queue[i].file.type ) ) {
          // remove o arquivo
          this.uploader.queue[i].remove();
          // alerta sobre o tipo permitido
          this.msgErrorFile = this.txt.fields.evidences.errors.fileType;
          setTimeout(() => this.msgErrorFile = null, 5000);
        }

      }
      this.onChangeValues();
    }
  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    // guarda o id do cfc
    const cfcId = this.form.get('drivingSchoolId').value;

    // falg de envio
    this.sent = true;

    // verifica erros
    this.onChangeValues();

    if ( this.form.valid ) {

      // array de valores retornados do upload de arquivos
      let arrFiles = [];

      // substitui os termos na msg
      const msg = this.txt.modalConfirmEntry.messages.replace(/{value}|{drivingSchool}/gi, val => {
        if ( val == '{value}' )
          return this.form.get('creditValue').value
        else
          return this.cfcList.find( cfc => cfc.id == cfcId ).company.name
      });
      // exibe dialog para confirmacao de adicao de creditos
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: new confirmDialogModel({
          title: this.txt.modalConfirmEntry.title,
          text: msg,
          buttonOk: this.txt.modalConfirmEntry.buttons.ok,
          buttonCancel: this.txt.modalConfirmEntry.buttons.cancel
        })
      });
      // escuta resposta do dialog
      let respDialog = dialogRef.afterClosed().subscribe(result => {
        // se clicou em ok
        if (result && result.choice == 'ok') {

          this.loading = true;
          this.form.disable();

          console.log('iniciando envio de arquivos');
          // pega o token
          this.authService.getToken()
            .subscribe( token => {
              // seta o token
              this.uploader.authToken = 'Bearer ' + token;
              // remove arquivos apos upload
              this.uploader.options.removeAfterUpload = true;
              // seta flag de envio de arquivos
              this.sendingFiles = true;
              // inicia o upload
              this.uploader.uploadAll();

              // a cada item completo adiciona os dados do arquivo no formulario
              this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                // pega os dados retornados
                const resp = JSON.parse(response);
                // console.log('item enviado', resp);
                // adiciona ao array de arquivos
                arrFiles.push( {relativeURL:resp.relativeURL} );
              };

            } );

        }
        // cancela escuta pela resposta
        respDialog.unsubscribe();
      });

      // apos fazer upload de todos os arquivos, envia o form
      this.uploader.onCompleteAll = () => {
        // cria elemento de FormGroup a partir da lista de arquivos
        const evidencesFG = arrFiles.map( file => this.formBuilder.group(file) );
        // cria o FormArray
        const evidencesArray = this.formBuilder.array(evidencesFG);
        // cria um novo form
        // por algum motivo obscuro o form é zerado ao adicionar os arquivos
        // então é criado um novo form para mater os dados marotos
        const newForm = this.formBuilder.group({
          drivingSchoolId: this.form.get('drivingSchoolId').value,
          creditValue: this.form.get('creditValue').value,
          justification: this.form.get('justification').value,
          evidences: this.formBuilder.array(evidencesFG)
        });
        console.log('valor do novo formulario', newForm.value);

        // envia os dados
        this.creditService.sendData(newForm.value, cfcId)
          .subscribe(
            res => {
              // seta flag e envio de arquivos
              this.sendingFiles = false;
              this.responseOk(res, null);
              this.sent = false;
              this.form.reset();
              this.form.get('drivingSchoolId').setValue(cfcId);
              this.onChooseCfc(cfcId);
              // limpa os erros dos arquivos
              this.formErrors['evidences'] = [];
            },
            error => this.responseError(error)
          );
      };

    }

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {Credit} data dados para o formulario
   */
  public showForm(data: Credit): void {

    // pega o id do cfc selecionado
    const cfcId = this.form.get('drivingSchoolId').value;
    // pega o nome do cfc selecionado
    data.drivingSchoolname = this.cfcList.find( cfc => cfc.id == cfcId ).company.name;

    let dialogRef = this.dialog.open(CreditReverseDialogComponent, {
      width: '600px',
      data: data
    });
    // escuta resposta do dialog
    let respDialog = dialogRef.afterClosed().subscribe(result => {
      // se clicou em ok
      if (result && result == 'saved') {
        // se salvou, carrega novamente a lista
        this.onChooseCfc(cfcId);
      }
      // cancela escuta pela resposta
      respDialog.unsubscribe();
    });

  }

  cancel() {}

}
