import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Subscription } from 'rxjs/Rx';

import { CommonFormComponent } from 'app/shared';
import { System } from './system.model';
import { SystemService } from './system.service';

@Component({
  selector: 'moduleCf-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de opcoes
  public listOpts = [
    {id: 5, value: '5 minutos'},
    {id: 10, value: '10 minutos'}
  ];
  // padrao para validar url
  private patternUrl = '^(http|https|ftp)?(://)?(www|ftp)?.?[a-z0-9-.]+(.|:)([a-z0-9-]+)+(.[a-z0-9]+)?([/?].*)?$';

  // mascara de numero - somente numeros
  public numMask4 = [/\d/,/\d/,/\d/,/\d/];
  public numMask6 = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];

  constructor(private systemService: SystemService,
              private injector:Injector) {
    //                modulo          pagina
    super(injector, ['moduleCf','system']);
  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      externalAccessUrl: [],
      lessonScheduler: [],
      maxSizeAttachment: [],
      scheduleOpenTime: [],
      scheduleCloseTime: [],
      scheduleTimeDivision: [],
      maxNumLessonsPerDayPerStudent: [],
      maxNumLessonsInSequencePerStudent: [],
      minIntervalBetweenLessonsSequence: [],
      maxSimultaneousLessonsPerInstructor: [],
      officialLessonTotalTime: [],
      officialLessonEffectiveTime: [],
      freeLessonTotalTime: [],
      freeLessonEffectiveTime: [],
      maxNumFreeLessonsPerDay: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      externalAccessUrl: {
        required: this.txt.fields.externalAccessUrl.errors.required,
        maxlength: this.txt.fields.externalAccessUrl.errors.maxlength,
        pattern: this.txt.fields.externalAccessUrl.errors.url,
      },
      lessonScheduler: { required: '' },
      scheduleOpenTime: {
        required: this.txt.fields.scheduleOpenTime.errors.required
      },
      scheduleCloseTime: {
        required: this.txt.fields.scheduleCloseTime.errors.required
      },
      scheduleTimeDivision: {
        required: this.txt.fields.scheduleTimeDivision.errors.required
      },
      maxNumLessonsPerDayPerStudent: {
        required: this.txt.fields.maxNumLessonsPerDayPerStudent.errors.required,
        maxlength: this.txt.fields.maxNumLessonsPerDayPerStudent.errors.maxlength,
      },
      maxNumLessonsInSequencePerStudent: {
        required: this.txt.fields.maxNumLessonsInSequencePerStudent.errors.required,
        maxlength: this.txt.fields.maxNumLessonsInSequencePerStudent.errors.maxlength,
      },
      minIntervalBetweenLessonsSequence: {
        required: this.txt.fields.minIntervalBetweenLessonsSequence.errors.required,
        maxlength: this.txt.fields.minIntervalBetweenLessonsSequence.errors.maxlength,
      },
      maxSimultaneousLessonsPerInstructor: {
        required: this.txt.fields.maxSimultaneousLessonsPerInstructor.errors.required,
        maxlength: this.txt.fields.maxSimultaneousLessonsPerInstructor.errors.maxlength,
      },
      officialLessonTotalTime: {
        required: this.txt.fields.officialLessonTotalTime.errors.required,
        maxlength: this.txt.fields.officialLessonTotalTime.errors.maxlength,
      },
      officialLessonEffectiveTime: {
        required: this.txt.fields.officialLessonEffectiveTime.errors.required,
        maxlength: this.txt.fields.officialLessonEffectiveTime.errors.maxlength,
      },
      freeLessonTotalTime: {
        required: this.txt.fields.freeLessonTotalTime.errors.required,
        maxlength: this.txt.fields.freeLessonTotalTime.errors.maxlength,
      },
      freeLessonEffectiveTime: {
        required: this.txt.fields.freeLessonEffectiveTime.errors.required,
        maxlength: this.txt.fields.freeLessonEffectiveTime.errors.maxlength,
      },
      maxNumFreeLessonsPerDay: {
        required: this.txt.fields.maxNumFreeLessonsPerDay.errors.required,
        maxlength: this.txt.fields.maxNumFreeLessonsPerDay.errors.maxlength,
      },
      maxSizeAttachment: {
        required: this.txt.fields.maxSizeAttachment.errors.required,
        maxlength: this.txt.fields.maxSizeAttachment.errors.maxlength,
      },
    };

    // inicializa o formulario
    this.buildForm();

    // pega as permissoes do usuario
    this._loadPermissions(1);
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
      externalAccessUrl: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(200), Validators.pattern(this.patternUrl)] ],
      lessonScheduler: [
        {value: null, disabled: true},
        Validators.required],
      scheduleOpenTime: [
        {value: null, disabled: true},
        Validators.required],
      scheduleCloseTime: [
        {value: null, disabled: true},
        Validators.required],
      scheduleTimeDivision: [
        {value: null, disabled: true},
        Validators.required],
      maxNumLessonsPerDayPerStudent: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      maxNumLessonsInSequencePerStudent: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      minIntervalBetweenLessonsSequence: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      maxSimultaneousLessonsPerInstructor: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      officialLessonTotalTime: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      officialLessonEffectiveTime: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      freeLessonTotalTime: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      freeLessonEffectiveTime: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      maxNumFreeLessonsPerDay: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(4), CustomValidators.range([1, 9999]), CustomValidators.number]],
      maxSizeAttachment: [
        {value: null, disabled: true},
        [Validators.required, Validators.maxLength(6), CustomValidators.range([1, 999999]), CustomValidators.number]],
    });

    // observa as mudancas
    this._afterBuildForm();

    // carrega os dados
    this.loadData();

  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    this._onChangeValues();

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    this._loadData(this.systemService);

  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(null, this.systemService);

  }

  cancel() {}

}
