import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
// import { DateLocale } from 'md2';

import { CommonFormComponent, objectToArray } from 'app/shared';
import { SimulationLesson } from '../simulation-lesson.model';
import { ScheduleLesson } from '../simulation-lesson.model';
import { SimulationLessonService } from '../simulation-lesson.service';
import { CancelSimulationLessonEventsService } from '../cancel-simulation-lesson-event.service';

@Component({
  templateUrl: 'simulation-lesson-dialog.component.html',
})
export class SimulationLessonDialogComponent extends CommonFormComponent implements OnInit, OnDestroy {

  // lista de tipos de aula
  public lessonTypeList: Array<{id:number; value:string;}> = [];
  // lista de modulos
  public moduleList: Array<{id:number; name:string;}> = [];
  // flag de modulo carregado
  public moduleListLoaded: boolean = false;
  // flag para bloquear/liberar edicao
  public editable: boolean;
  // se pode cancelar
  public canCancel: boolean;

  constructor(@Inject(MD_DIALOG_DATA) public data: ScheduleLesson,
              private dialogRef: MdDialogRef<SimulationLessonDialogComponent>,
              private simulationLessonService: SimulationLessonService,
              // private dateLocale: DateLocale,
              private injector:Injector) {
    //                modulo     pagina
    super(injector, ['moduleA','simulationLesson']);

    // se pode ou nao editar
    this.editable = this.data.id === null ? true : ( this.data.startDate > (new Date()) );

    this.lessonTypeList = objectToArray(this.txt.fields.lessonType.options);

    // carrega lista de modulos
    this.loadModules(this.data.simulatorId);

    // verifica as permissoes do usuario
    this.authService.getAuthUser()
      .subscribe( permissions => {
        console.log('permissoes', permissions);
        const date = new Date();
        // se pode cancelar o evento
        this.canCancel = (
          this.data.id !== null && // verifica se tem id (se nao esta criando um agendamento)
          (this.data.status === 0 || this.data.status === 1) && ( // verifica o status
            permissions.userType.id == 1 || // se for admin
            ( ((this.data.startDate as Date).getTime() - date.getTime()) / (1000*60*60) ) >= 24 // se nao for admin, ate 24h antes
          )
        );
      } );

  }

  ngOnInit() {
    // lista de erros de validacao
    this.formErrors = {
      instructorId: [],
      startDate: [],
      moduleId: [],
    };

    // lista de mensagens de erros de validacao
    this.validationMessages = {
      instructorId: {
        simultaneous: this.txt.messages.scheduleAlert.maxSimultaneousLessonsPerInstructor.replace('{n}',this.data.system.maxSimultaneousLessonsPerInstructor),
      },
      startDate: {
        required: this.txt.fields.date.errors.required,
        maxSequence: this.txt.messages.scheduleAlert.maxNumLessonsInSequencePerStudent.replace('{n}',this.data.system.maxNumLessonsInSequencePerStudent),
        overlapping: this.txt.messages.scheduleAlert.overlappingLesson
      },
      moduleId: {
        // required: this.txt.fields.type.errors.required,
      },
    };

    // inicializa o formulario
    this.buildForm();

    // registra o listenner
    this.registerLoginListenner(this.dialogRef);
  }

  ngOnDestroy() {
    // cancela o listenner ao sair
    this.cancelListenners();
  }

  /**
   * carrega lista de modulos disponiveis para esse simulador
   */
  public loadModules(simulatorId): void {
    // pega o id da versao do software
    const softwareVersionId:number = this.data.simulatorlist.find( el => el.simulator.id == simulatorId ).softwareVersion.id;
    // carrega lista de modulos
    this.simulationLessonService.loadModules(softwareVersionId)
      .subscribe( resModules => {
        console.log('modulos carregados', resModules);
        resModules.forEach( (e,i,a) => {
          this.moduleList.push({
            id: e.id,
            name: e.description
          });
        } );
        this.moduleListLoaded = true;
      } );
  }

  /**
   * cria o formulario
   */
  public buildForm(): void {
    this.form = this.formBuilder.group({
      id: this.data.id,
      startDate: [
        {value: this.data.startDate, disabled: false}],
      endDate: [
        {value: this.data.endDate, disabled: false}],
      drivingSchoolId: [
        {value: this.data.drivingSchoolId, disabled: false}],
      studentId: [
        {value: this.data.studentId, disabled: false}],
      lessonType: [
        {value: this.data.lessonType, disabled: false}],
      simulatorId: [
        {value: this.data.simulatorId, disabled: false}],
      vehicleModelId: [
        {value: this.data.vehicleModelId, disabled: false}],
      instructorId: [
        {value: this.data.instructorId, disabled: false}],
      moduleId: [
        {value: this.data.moduleId, disabled: false}]
    });

    // observa as mudancas
    this._afterBuildForm();
  }

  /**
   * faz a validacao dos campos e atribui as mensagens de erros
   */
  public onChangeValues(): void {

    // valida o maximo de aulas simultaneas por instrutor
    if ( !this.validateMaxSimultaneousLessonsPerInstructor() ) {
      this.form.get('instructorId').setErrors({simultaneous:true});
    } else {
      this.form.get('instructorId').setErrors(null);
    }
    // valida numero maximo de aulas em sequencia
    if ( !this.validateMaxNumLessonsInSequencePerStudent() ) {
      this.form.get('startDate').setErrors({maxSequence:true});
    } else {
      // valida sebrepos a aula a outra
      if ( !this.validateOverlappingLesson() ) {
        this.form.get('startDate').setErrors({overlapping:true});
        // console.log('nao passou');
      } else {
        // console.log('passou');
        this.form.get('startDate').setErrors(null);
      }
    }

    this.sent = true;
    this._onChangeValues();

  }

  private validateOverlappingLesson(): boolean {
    // hora de inicio
    const startDate = this.form.get('startDate').value;
    const endDate = this.form.get('endDate').value;
    // encontra outros eventos onde o horario estaja sobreposto
    const overSimLess = this.data.simulationLessonList.filter( el => (
      el.studentId == this.data.studentId && (
        (el.startDate <= startDate && el.endDate > startDate) ||
        (el.endDate >= endDate && el.startDate < endDate)
      )
    ) );
    console.log('overSimLess',overSimLess);
    if ( overSimLess.length > 0 ) {
      return false;
    }
    return true;
  }

  /**
   * verifica se o instrutor esta no limite de aulas simultaneas
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxSimultaneousLessonsPerInstructor(): boolean {
    // instrutor selecionado
    const instructorId = this.form.get('instructorId').value;
    // horario de inicio e fim da aula a ser agendada
    const startDate = this.form.get('startDate').value;
    const endDate = this.form.get('endDate').value;
    // pega as aulas do instrutor selecionado no mesmo horario
    const instructorLessons = this.data.simulationLessonList.filter( el => {
        return el.instructorId == instructorId && (
          (el.startDate <= startDate && el.endDate >= startDate) ||
          (el.startDate <= endDate && el.endDate >= endDate)
        );
      } );
    // se estiver adicionando um evento, adiciona mais 1 na lista
    const m = this.data.id === null ? 1 : 0;
    if ( instructorLessons && (instructorLessons.length + m) > this.data.system.maxSimultaneousLessonsPerInstructor ) {
      return false;
    }
    return true;
  }

  /**
   * verifica se atingiu o numero maximo de aulas em sequencia para o mesmo aluno
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxNumLessonsInSequencePerStudent(): boolean {
    // verifica se é uma sequencia
    const arrSequences = this.getSequence();
    // console.log('array de aulas', arrSequences);
    // verifica se a sequencia tem o tamanho maximo permitido
    if (arrSequences.length > this.data.system.maxNumLessonsInSequencePerStudent) {
      return false;
    }
    return true;
  }

  /**
   * ao mudar hora de inicio
   */
  public onChangeStartDate(): void {
    // pega a hora
    let startDate = this.form.get('startDate').value;
    // nova hora de fim
    let endDate = new Date(startDate);
    // adiciona intervalo de tempo
    endDate.setMinutes( startDate.getMinutes() + this.data.timeToAddOnEnd );
    // seta no formulario
    this.form.get('endDate').setValue( endDate );
    // console.log(startDate, endDate);
  }

  /**
   * retorna uma lista de objetos contendo a hora de inicio e fim da aula
   * pega todas as aulas antes e depois do evennto se forem sequenciais
   * @return {Array}        array de objetos contendo a hora de inicio e fim da aula
   */
  private getSequence(): Array<{start:Date, end:Date}> {
    const startDate = this.form.get('startDate').value;
    const endDate = this.form.get('endDate').value;
    // pega todas as aulas do aluno
    const studentLessons = this.data.simulationLessonList.filter( el => el.studentId == this.data.studentId );

    if ( studentLessons ) {
      // array de aulas em sequencia
      let arrSequences = [];
      // inicializa o array com a aula adicionada
      arrSequences[0] = {start:startDate, end:endDate};
      // busca aulas anteriores
      const findBeforeLesson = (actualKey, beforeKey?) => {
        // keys para o array
        let i = beforeKey || actualKey-1;
        // procura alguma aula q termine na mesma hora que a atual inicia
        const before = studentLessons.find( el => (el.endDate as Date).toLocaleTimeString() == arrSequences[actualKey].start.toLocaleTimeString() );
        // se encontrou, adiciona no array
        if ( before ) {
          arrSequences[i] = {start:before.startDate, end:before.endDate};
          // procura por outra anterior
          findBeforeLesson(i, i-1);
        }
      }
      // inicia busca
      findBeforeLesson(0);
      // busca aulas posteriores
      const findAfterLessons = (actualKey, afterKey?) => {
        // keys para o array
        let i = afterKey || actualKey+1;
        // procura alguma aula que inicie na mesma hora q a atual termina
        const after = studentLessons.find( el => (el.startDate as Date).toLocaleTimeString() == arrSequences[actualKey].end.toLocaleTimeString() );
        // se encontrou, adiciona no array
        if ( after ) {
          arrSequences[i] = {start:after.startDate, end:after.endDate};
          // procura pela proxima
          findAfterLessons(i,i+1);
        }
      }
      // inicia a busca
      findAfterLessons(0);
      // corrige a ordem e os ids
      let arrSequencesCorrect = [];
      for (let i in arrSequences) {
        if (+i >= 0)
          arrSequencesCorrect.push( arrSequences[i] );
        else
          arrSequencesCorrect.unshift( arrSequences[i] );
      }
      return arrSequencesCorrect;
    }
    return [{start:(this.data.startDate as Date), end:(this.data.endDate as Date)}];
  }

  /**
   * envia os dados do formulario
   */
  public send(): void {

    this._send(this.data.id, this.simulationLessonService, this.dialogRef, this.data.simulatorId, this.data.drivingSchoolId);

  }

  public cancelSimulationLesson(event: MouseEvent): void {
    event.preventDefault();
    this.dialogRef.close('cancel');
    // emite evento de cancelamento
    CancelSimulationLessonEventsService.emitCancel.emit(this.data.id);
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
