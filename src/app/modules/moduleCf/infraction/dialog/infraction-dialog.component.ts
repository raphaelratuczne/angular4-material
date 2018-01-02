import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
// import { Subscription } from 'rxjs/Rx';

import { objectToArray, CommonFormComponent } from 'app/shared';
import { Infraction } from '../infraction.model';
import { InfractionService } from '../infraction.service';

@Component({
  templateUrl: 'infraction-dialog.component.html',
})
export class InfractionDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // flag do titulo
  public forAdd: boolean;
  // lista de categorias
  public categoriesList: {id:number, value:string}[];
  // mascara de codigo - somente numeros
  public codeMask = [/\d/,/\d/,/\d/,/\d/,/\d/];
  // mascara de pontos - somente numeros
  public pointsMask = [/\d/,/\d/];

  constructor(@Inject(MD_DIALOG_DATA) public data: Infraction,
              private dialogRef: MdDialogRef<InfractionDialogComponent>,
              private infractionService: InfractionService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','infraction']);

    // seta flag se esta adicionando ou editando os valores
    this.forAdd = (Object.assign({}, this.data)).code !== null;
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      code: [],
      category: [],
      points: [],
      article: [],
      paragraph: [],
      law: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      code: {
        required: this.txt.fields.code.errors.required,
        maxlength: this.txt.fields.code.errors.maxlength,
        range: this.txt.fields.code.errors.range,
        number: this.txt.fields.code.errors.number,
      },
      category: {
        required: this.txt.fields.category.errors.required,
      },
      points: {
        required: this.txt.fields.points.errors.required,
        maxlength: this.txt.fields.points.errors.maxlength,
        range: this.txt.fields.points.errors.range,
        number: this.txt.fields.points.errors.number,
      },
      article: {
        required: this.txt.fields.article.errors.required,
        maxlength: this.txt.fields.article.errors.maxlength,
      },
      paragraph: {
        required: this.txt.fields.paragraph.errors.required,
        maxlength: this.txt.fields.paragraph.errors.maxlength,
      },
      law: {
        required: this.txt.fields.law.errors.required,
        maxlength: this.txt.fields.law.errors.maxlength,
      },
    };

    // inicializa o formulario
    this.buildForm();

    this.registerLoginListenner(this.dialogRef);

    // carrega as categorias
    this.infractionService.loadCategories()
      .subscribe(
        cats => {
          this.categoriesList = objectToArray(cats);
        },
        error => {
          console.error(error);
          // exibe mensagem de erro
          this.snackBar.open(this.txt.messages.error, 'Ok', {duration: 2000});
          // fecha o dialog
          this.dialogRef.close('error');
        }
      );
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
      code: [
        {value: this.data.code, disabled: (this.data.code !== null ? true : false)},
        [Validators.required, Validators.maxLength(5), CustomValidators.range([1, 99999]), CustomValidators.number]],
      category: [
        {value: this.data.category, disabled: false},
        Validators.required],
      points: [
        {value: this.data.points, disabled: false},
        [Validators.required, Validators.maxLength(2), CustomValidators.range([1, 99]), CustomValidators.number]],
      article: [
        {value: this.data.article, disabled: false},
        [Validators.required, Validators.maxLength(10)]],
      paragraph: [
        {value: this.data.paragraph, disabled: false},
        [Validators.required, Validators.maxLength(10)]],
      law: [
        {value: this.data.law, disabled: false},
        [Validators.required, Validators.maxLength(255)]],
    });

    this._afterBuildForm();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(this.data.code, this.infractionService, this.dialogRef);

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
