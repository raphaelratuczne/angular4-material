import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CommonListComponent,
         getKeyByValue,
         ConfirmDialogComponent,
         confirmDialogModel } from 'app/shared';
import { SimulationLesson } from './simulation-lesson.model';
import { StudentPendingScheduling } from './simulation-lesson.model';
import { ActiveInstructor } from './simulation-lesson.model';
import { ActiveSimulator } from './simulation-lesson.model';
import { DrivingSchool } from './simulation-lesson.model';
import { ScheduleLesson } from './simulation-lesson.model';
import { ScheduleCalendarEvent } from './simulation-lesson.model';
import { SimulationLessonService } from './simulation-lesson.service';
import { SimulationLessonDialogComponent } from './dialog/simulation-lesson-dialog.component';
import { System, SystemService } from '../../moduleCf/system';
import { Holiday, HolidayService } from '../../moduleCf/holiday';
import { VehicleModel, VehicleModelService } from '../../moduleCf/vehicle-model';
import { CancelSimulationLessonEventsService } from './cancel-simulation-lesson-event.service';

import { ScheduleCalendarComponent } from 'app/shared/components/schedule/schedule-calendar/schedule-calendar.component';

@Component({
  selector: 'moduleA-simulation-lesson',
  templateUrl: './simulation-lesson.component.html',
  styleUrls: ['./simulation-lesson.component.scss']
})
export class SimulationLessonComponent extends CommonListComponent implements OnInit, OnDestroy {

  @ViewChild(ScheduleCalendarComponent) scheduleCalendar: ScheduleCalendarComponent;

  // dada atual
  public date = new Date();
  // valores de configuracao do sistema
  private system: System;
  // dados do centro compartilhado
  public drivingSchool: DrivingSchool = null;
  // lista de cores para simuladores
  private arrColors = ['green', 'orange', 'red', 'gray', 'blue', 'violet', 'brown'];

  public options = {
    locale: 'pt-br', // local
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenca
		defaultView: 'agendaDay', // visao padrao: agenda do dia
		defaultDate: this.getDate(this.date), // data padrao - hoje
		editable: true, // editavel
		selectable: true, // selecionavel
		eventLimit: true, // limite de eventos
    slotLabelFormat: 'HH:mm', // formato de horas
    // slotDuration: '00:10:00', // divisao do slots de horas
    // minTime: '06:00:00', // hora inicial do dia
    // maxTime: '21:00:00', // hora final do dia
    // validRange: { // periodo valido
    //   start: '2017-11-14', // dia inicial
    //   end: '2017-11-30' // dia final
    // },
    height: 500, // altura em px
    allDaySlot: false, // slot dia inteiro
    droppable: true, // se pode soltar eventos em cima do calendario
		header: { // cabecalho
			// left: 'prev,next today', // coluna esquerda
			left: '', // coluna esquerda
			center: 'title', // meio
			right: '' // coluna direita
		},
    refetchResourcesOnNavigate: true,
		resources: [ // lista de colunas (simuladores)
			// { id: 'a', title: 'Simulador A' },
			// { id: 'b', title: 'Simulador B', eventColor: 'green' },
			// { id: 'c', title: 'Simulador C', eventColor: 'orange' },
			// { id: 'd', title: 'Simulador D', eventColor: 'red' },
			// { id: 'e', title: 'Simulador E', eventColor: 'gray' },
			// { id: 'f', title: 'Simulador F', eventColor: 'blue' },
			// { id: 'g', title: 'Simulador G', eventColor: 'violet' },
			// { id: 'h', title: 'Simulador H', eventColor: 'brown' }
		],
		events: [ // lista de eventos (agendamentos)
			// { id: '1', resourceId: 'a', start: '2017-11-15T08:30:00', end: '2017-11-15T09:00:00', title: 'event 1', overlap: false, durationEditable: false },
			// { id: '2', resourceId: 'b', start: '2017-11-15T09:30:00', end: '2017-11-15T11:00:00', title: 'event 2', overlap: false, durationEditable: false },
			// { id: '3', resourceId: 'c', start: '2017-11-15T08:20:00', end: '2017-11-15T09:20:00', title: 'event 3', overlap: false, durationEditable: false },
			// { id: '4', resourceId: 'd', start: '2017-11-15T08:30:00', end: '2017-11-15T09:30:00', title: 'event 4', overlap: false, durationEditable: false },
			// { id: '5', resourceId: 'e', start: '2017-11-15T10:00:00', end: '2017-11-15T11:00:00', title: 'event 5', overlap: false, durationEditable: false },
			// { id: '6', resourceId: 'f', start: '2017-11-15T10:00:00', end: '2017-11-15T11:00:00', title: 'event 6', overlap: false, durationEditable: false },
			// { id: '7', resourceId: 'g', start: '2017-11-15T10:00:00', end: '2017-11-15T11:00:00', title: 'event 7', overlap: false, durationEditable: false },
			// { id: '8', resourceId: 'h', start: '2017-11-15T10:00:00', end: '2017-11-15T11:00:00', title: 'event 8', overlap: false, durationEditable: false },
      // { // evento para bloquear intervalos
			// 	start: '2017-11-26T08:00:00',
			// 	end: '2017-11-26T18:00:00',
			// 	overlap: false,
			// 	rendering: 'background',
			// 	color: '#ff9f89',
      //   title: 'feriado'
			// },
		],
		// select: function(start, end, jsEvent, view, resource) { // ao selecionar um slot
		// 	console.log(
		// 		'select',
		// 		start.format(),
		// 		end.format(),
		// 		resource ? resource.id : '(no resource)'
		// 	);
		// },
		// dayClick: function(date, jsEvent, view, resource) {
		// 	console.log(
		// 		'dayClick',
		// 		date.format(),
		// 		resource ? resource.id : '(no resource)'
		// 	);
		// },
    drop: (date, jsEvent, ui, resourceId) => { // ao soltar evento externo
      // $(this).remove();
      console.log('dropped on ' + date.format(), date, jsEvent, ui, resourceId);
    },
    eventReceive: (event) => { // ao receber evento externo
			console.log('eventReceive', event);
      this.showForm(event);
		},
		eventDrop: (event) => { // ao soltar um evento (que ja estava na agenda)
			console.log('eventDrop', event);
		},
    eventClick: (event, element) => {
      console.log('clicado', event, element);
      this.showEditForm(event);
    }
	};

  // lista de eventos para arrastar para a agenda
  public eventsList: ScheduleCalendarEvent[] = [];
  // variavel temporaria para guardar os eventos antes de exibir
  public eventsListTemp: ScheduleCalendarEvent[] = [];
  // lista de cfcs
  public drivingSchoolList: Array<{id:number; name:string;}> = [];
  // flag se carregou lista de cfcs
  public drivingSchoolListLoaded: boolean = false;
  // cfc selecionado
  public drivingSchoolId: number;
  // lista de estudantes
  public studentList: Array<{id:number; name:string;}> = [];
  // flag se carregou lista de alunos
  public studentListLoaded: boolean = false;
  // aluno selecionado
  public studentId: number;
  // lista de instrutores
  public instructorList: Array<{id:number; name:string;}> = [];
  // flag se carregou lista de instrutores
  public instructorListLoaded: boolean = false;
  // instrutor selecionado
  public instructorId: number;
  // lista de modelos de veiculos
  public vehiclesList: Array<{id:number; name:string;}> = [];
  // flag se carregou lista de modelos de veiculos
  public vehiclesListLoaded: boolean = false;
  // modelo de veiculo selecionado
  public vehicleModelId: number;
  // lista de simuladores
  public simulatorlist: ActiveSimulator[] = [];
  // lista de eventos carregados
  public simulationLessonList: SimulationLesson[];
  // referencia para escutar evento de cancelamento
  private cancelListenner;

  constructor(private simulationLessonService: SimulationLessonService,
              private systemService: SystemService,
              private holidayService: HolidayService,
              private vehicleModelService: VehicleModelService,
              private injector:Injector) {
    //                modulo    pagina
    super(injector, ['moduleA','simulationLesson']);
  }

  ngOnInit() {
    // carrega os dados
    // this.loadData();

    // carrega configuracao
    this.loadModuleCf();

    // carrega lista de cfcs
    this.loadDrivingSchool();

    // carrega lista de alunos
    this.loadStudents();

    // carrega lista de instrutores
    this.loadInstructors();

    // carrega lista de modelos de veiculos
    this.loadVehicleModels();

    // pega as permissoes do usuario
    this._loadPermissions(22);

    // fica escutando evento de cancelamento de aula
    this.cancelListenner = CancelSimulationLessonEventsService.emitCancel.subscribe( id => {
      this.delete(id);
    } );

  }

  ngOnDestroy() {
    this.cancelListenner.unsubscribe();
  }

  /**
   * formata data para yyyy-mm-dd
   * @param  {Date}   date objeto de data
   * @return {string}      data yyyy-mm-dd
   */
  private getDate(date:Date): string {
    return date.toLocaleDateString().replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
  }

  /**
   * formata data para yyyy-mm-ddThh:mm:ss
   * @param  {Date}   date objeto de data
   * @param  {Date}   time objeto de data
   * @return {string}      data e hora yyyy-mm-ddThh:mm:ss
   */
  private getDateTime(date:Date, time?:Date): string {
    if ( time )
      return date.toLocaleDateString().replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1') + 'T' + time.toLocaleTimeString();
    else
      return date.toLocaleString().replace(/(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4');
  }

  /**
   * converte minutos em horas (ex: 50 = 00:50; 85 = 01:25)
   * @param  {number} minutes minutos
   * @return {string}         horas
   */
  private minutesToHours(minutes:number): string {
    let date = new Date(null);
    date.setUTCMinutes( minutes );
    return date.toISOString().split('T')[1].split('.')[0].substr(0,5);
  }

  /**
   * faz o filtro de dados para feriados variaveis
   * @return {SimulationLesson[]} [description]
   */
  public listData(): SimulationLesson[] {

    // return this._listData(this.list, this.filter, 'SimulationLessonDate:date', 'description');
    return this.list;

  }

  /**
   * solicita os dados
   */
  public loadData(): void {

    // this._loadData(this.simulationLessonService, this.date.getTime());
    this.scheduleCalendar.setCalendar('removeEvents');

    // carrega lista de feriados
    this.loadHolidays();

    // carrega lista de aulas agendadas
    this.loadSimulationLesson();

    // carrega novamente aulas disponiveis
    this.onChangeStudent();

  }

  /**
   * carrega dados de configuracao do sistema
   */
  public loadModuleCf(): void {
    this.systemService.loadData()
      .subscribe( respSys => {
        console.log('configuracoes do sistema', respSys);
        this.system = respSys;
        // seta configuracoes do calendario
        const config = {
          // intervalo de tempo
          slotDuration: this.system.scheduleTimeDivision == 10 ? '00:10:00' : '00:05:00',
          // hora de inicio da agenda
          minTime: (this.system.scheduleOpenTime as Date).toLocaleTimeString(),
          // hora de fim da agenda
          maxTime: (this.system.scheduleCloseTime as Date).toLocaleTimeString(),
        };
        // aguarda um tempo para que de tempo da agenda ser carregada
        setTimeout(()=>{this.scheduleCalendar.setCalendar('option', config);},600);

        // carrega lista de simuladores do dia
        this.loadSimulators(this.date);

        // carrega lista de feriados
        this.loadHolidays();

        // carrega lista de aulas agendadas
        this.loadSimulationLesson();
      } );
  }

  /**
   * carrega lista de aulas agendadas para o dia
   */
  public loadSimulationLesson(): void {
    this.simulationLessonService.loadData(this.date.getTime())
      .subscribe( resLess => {
        console.log('aulas agendadas', resLess);
        this.simulationLessonList = resLess;
        resLess.forEach( (e, i, a) => {
          // cria objeto de evento
          const lesson = {
            id: e.id,
            resourceId: e.simulatorId,
            start: this.getDateTime(e.startDate as Date),
            end: this.getDateTime(e.endDate as Date),
            title: e.studentName,
            overlap: false,
            durationEditable: false,
            editable: ((e.startDate as Date) > this.date)
          };

          this.scheduleCalendar.setCalendar('renderEvent', lesson, false);
        } );

      } );
  }

  /**
   * carrega lista de simuladores do dia e seta na agenda
   * @param {Date} date dia
   */
  public loadSimulators(date:Date):void {
    // carrega lista de simuladores
    this.simulationLessonService.loadSimulators(date.getTime())
      .subscribe( respSim => {
        console.log('simuladores', respSim);
        this.simulatorlist = respSim;
        let i = 0 // contador
        const tot = this.arrColors.length; // total de cores
        respSim.forEach( (e, i, a) => {
          // cria objeto de simulador para a agenda
          let resource = {
            id:     e.simulator.id,
            title:  e.simulator.name + ' - ' + e.company.name
          };
          // cor da coluna
          if (i !== 0) { // se for 0, usa cor padrao
            resource['eventColor'] = this.arrColors[i-1];
          }
          i++;
          // se passou por toda a lista de cores, comeca novamente
          if (i === tot) {
            i = 0;
          }
          // adiciona coluna de simulador a agenda
          this.scheduleCalendar.setCalendar('addResource', resource);
          // console.log('simulador', resource);
        } );
      } );
  }

  /**
   * carrega lista de feriados
   */
  public loadHolidays():void {
    this.holidayService.loadData()
      .subscribe( resHol => {
        console.log('feriados', resHol);
        resHol.forEach( (e, i, a) => {
          // dia do feriado formato 'yyyy-mm-dd'
          const start = this.getDateTime(e.holidayDate as Date, this.system.scheduleOpenTime as Date);
          // adiciona 1 dia para seta o final do feriado
          const end = this.getDateTime(e.holidayDate as Date, this.system.scheduleCloseTime as Date);
          // cria objeto de evento
          const holidayEvt = { // evento para bloquear intervalos
            title: 'Feriado',
            start: start,
            end: end,
            overlap: false,
            rendering: 'background',
            color: '#ff9f89'
          };
          // adiciona o feriado a agenda
          this.scheduleCalendar.setCalendar('renderEvent', holidayEvt, true);
        } );
      } );
  }

  /**
   * carrega lista de cfcs
   */
  public loadDrivingSchool(): void {
    this.simulationLessonService.loadDrivingSchool()
      .subscribe( resDrvSchool => {
        console.log('centro compartilhado', resDrvSchool);
        // se é um centro compartilhado e possui cfcs cadastrados
        if ( resDrvSchool.relatedDrivingSchools.length > 0 ) {
          resDrvSchool.relatedDrivingSchools.forEach( (e,i,a) => {
            this.drivingSchoolList.push({
              id: e.company.id,
              name: e.company.name
            });
          } );
        }
        this.drivingSchoolListLoaded = true;
      } );
  }

  /**
   * carrega lista de alunos
   */
  public loadStudents(): void {
    this.simulationLessonService.loadStudents()
      .subscribe( resStudents => {
        console.log('alunos', resStudents);
        resStudents.forEach( (e,i,a) => {
          this.studentList.push({
            id: e.id,
            name: e.person.name
          });
        } );
        this.studentListLoaded = true;
      } );
  }

  /**
   * carrega lista de instrutores
   */
  public loadInstructors(): void {
    this.simulationLessonService.loadInstructors()
      .subscribe( resInstructors => {
        console.log('instrutores', resInstructors);
        resInstructors.forEach( (e,i,a) => {
          this.instructorList.push({
            id: e.id,
            name: e.person.name
          });
        } );
        this.instructorListLoaded = true;
      } );
  }

  /**
   * carrega lista de modelos de veiculos
   */
  public loadVehicleModels(): void {
    this.vehicleModelService.loadData()
      .subscribe( resVehicles => {
        console.log('modelos de veiculos', resVehicles);
        resVehicles.forEach( (e,i,a) => {
          this.vehiclesList.push({
            id: e.id,
            name: e.description
          });
        } );
        this.vehiclesListLoaded = true;
      } );
  }

  /**
   * ao mudar o dia
   */
  public onChangeDate(): void {
    // console.log(this.date);
    this.scheduleCalendar.setCalendar('gotoDate', this.getDate(this.date));
    this.loadSimulators(this.date);
    this.loadSimulationLesson();
  }

  /**
   * ao selecionar o estudante
   */
  public onChangeStudent(): void {
    // limpa lista da aulas disponiveis
    this.eventsList = [];
    this.eventsListTemp = [];
    console.log(this.studentId);
    // se selecionou algum estudante
    if ( this.studentId ) {
      // carrega lista de aulas disponiveis para o aluno
      this.simulationLessonService.loadLessons(this.studentId)
      .subscribe( resLessons => {
        console.log('lista de aulas disponiveis', resLessons);
        // limpa lista de eventos
        this.eventsListTemp = [];
        // aulas detran
        if ( typeof resLessons[0] == 'number' ) {
          for (let i = 0; i < resLessons[0]; i++) {
            this.eventsListTemp.push({
              title: this.txt.fields.lessonType.options[0],
              color: 'blue',
            	stick: true,
              duration: this.minutesToHours(this.system.officialLessonTotalTime),
              overlap: false,
              durationEditable: false
            });
          }
        }
        // aulas avulsas
        if ( typeof resLessons[1] == 'number' ) {
          for (let i = 0; i < resLessons[1]; i++) {
            this.eventsListTemp.push({
              title: this.txt.fields.lessonType.options[1],
              color: 'green',
              stick: true,
              duration: this.minutesToHours(this.system.officialLessonTotalTime),
              overlap: false,
              durationEditable: false
            });
          }
        }
        // aulas livres
        if ( typeof resLessons[2] == 'number' ) {
          for (let i = 0; i < resLessons[2]; i++) {
            this.eventsListTemp.push({
              title: this.txt.fields.lessonType.options[2],
              color: 'yellow',
              stick: true,
              duration: this.minutesToHours(this.system.freeLessonTotalTime),
              overlap: false,
              durationEditable: false
            });
          }
        }
        this.verifyScheduleCalendarEvents();
      } );
    }
  }

  /**
   * verifica se todos os campos foram preenchidos antes de exibir as aulas disponiveis
   */
  private verifyScheduleCalendarEvents(): void {
    // se ha aulas disponiveis
    if (this.eventsListTemp.length > 0) {
      // verifica campos obrigatorios
      if (this.studentId && this.instructorId && this.vehicleModelId) {
        // se for um centro compartilhado, verifica se selecionou um cfc
        if (this.drivingSchoolList.length > 0 && this.drivingSchoolId) {
          this.eventsList = this.eventsListTemp;
          // mapeia os eventos arrastaveis
          setTimeout(()=>this.scheduleCalendar.setDraggable(),1000);
        } else {
          if (this.drivingSchoolList.length == 0) {
            this.eventsList = this.eventsListTemp;
            // mapeia os eventos arrastaveis
            setTimeout(()=>this.scheduleCalendar.setDraggable(),1000);
          } else {
            this.eventsList = [];
          }
        }
      } else {
        this.eventsList = [];
      }
    }
  }

  /**
   * ao alterar valores
   */
  public onChange(): void {

    this.verifyScheduleCalendarEvents();

  }

  /**
   * exibe o dialog com o formulario para add/editar
   * @param {SimulationLesson} data dados para o formulario
   */
  public showForm(event): void {

    // valida a data/hora do evento
    if ( !this.validateDate(event) ) return;
    // valida aulas simultaneas em 2 simuladores
    if ( !this.validateSimultaneousLessonsPerStudent(event) ) return;
    // valida maximo de aulas por instrutor
    if ( !this.validateMaxSimultaneousLessonsPerInstructor(event) ) return;
    // valida maximo de aulas livres por dia
    if ( !this.validateMaxNumFreeLessonsPerDay(event) ) return;
    // valida maximo de aulas para o mesmo aluno
    if ( !this.validateMaxNumLessonsPerDayPerStudent(event) ) return;
    // valida maximo de aulas em sequencia
    if ( !this.validateMaxNumLessonsInSequencePerStudent(event) ) return;
    // valida intervalo entre sequencias
    if ( !this.validateMinIntervalBetweenLessonsSequence(event) ) return;

    let data = new ScheduleLesson(null);
    data.startDate = new Date(event.start.format());
    data.endDate = new Date(event.end.format());
    data.drivingSchoolList = this.drivingSchoolList;
    data.drivingSchoolId = this.drivingSchoolId;
    data.studentList = this.studentList;
    data.studentId = this.studentId;
    data.lessonType = getKeyByValue(this.txt.fields.lessonType.options, event.title);
    data.simulatorlist = this.simulatorlist;
    data.simulatorId = +event.resourceId;
    data.vehiclesList = this.vehiclesList;
    data.vehicleModelId = this.vehicleModelId;
    data.instructorList = this.instructorList;
    data.instructorId = this.instructorId;
    data.timeToAddOnEnd = data.lessonType == 2 ? this.system.freeLessonTotalTime : this.system.officialLessonTotalTime;
    data.simulationLessonList = this.simulationLessonList;
    data.system = this.system;

    this._showForm(SimulationLessonDialogComponent, data, null,
      () => {
        // se salvou, remove todos os eventos do dia para carregar novamente
        // this.scheduleCalendar.setCalendar('removeEvents');
      },
      () => {
        // se nao salvou, remove o evento do calendario
        this.scheduleCalendar.setCalendar('removeEvents', event._id);
      }, true);

  }


  public showEditForm(event):void {
    // pega os dados da aula agendada
    const simulationLesson = this.simulationLessonList.find( el => el.id == event.id );

    let data = new ScheduleLesson(null);
    data.id = simulationLesson.id;
    data.startDate = simulationLesson.startDate;
    data.endDate = simulationLesson.endDate;
    data.drivingSchoolList = [{id:simulationLesson.companyId, name:simulationLesson.companyTradingName}];
    data.drivingSchoolId = simulationLesson.companyId;
    data.studentList = [{id:simulationLesson.studentId, name:simulationLesson.studentName}];
    data.studentId = simulationLesson.studentId;
    data.lessonType = simulationLesson.lessonType;
    data.simulatorlist = this.simulatorlist;
    data.simulatorId = simulationLesson.simulatorId;
    data.vehiclesList = this.vehiclesList;
    data.vehicleModelId = simulationLesson.vehicleModelId;
    data.instructorList = this.instructorList;
    data.instructorId = simulationLesson.instructorId;
    data.timeToAddOnEnd = data.lessonType == 2 ? this.system.freeLessonTotalTime : this.system.officialLessonTotalTime;
    data.moduleId = simulationLesson.moduleId;
    data.moduleList = [{id:simulationLesson.moduleId, name:simulationLesson.moduleDescription}];
    data.status = simulationLesson.status;
    data.simulationLessonList = this.simulationLessonList;
    data.system = this.system;

    this._showForm(SimulationLessonDialogComponent, data);

  }

  /**
   * verifica se a data e hora escolhida é uma data futura (nao pode agendar para uma data passada)
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateDate(event): boolean {
    const actualDate = new Date();
    const choseDate = new Date(event.start.format());
    if ( choseDate < actualDate ) {
      this.scheduleCalendar.setCalendar('removeEvents', event._id);
      this.alertMsg('olderDate');
      return false;
    }
    return true;
  }

  /**
   * verifica se esta agendando aulas em diferentes simuladores no mesmo horario
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateSimultaneousLessonsPerStudent(event): boolean {
    // converte as datas
    const startDate = new Date(event.start.format());
    const endDate = new Date(event.end.format());
    // procura por alguma aula simultanea
    const simultaneousLesson = this.simulationLessonList.find( el =>
      el.studentId == this.studentId && (
        ( el.startDate < startDate && el.endDate > startDate ) ||
        ( el.startDate < endDate && el.endDate > endDate )
      )
    );
    if ( simultaneousLesson ) {
      this.scheduleCalendar.setCalendar('removeEvents', event._id);
      this.alertMsg('simultaneousLessonsPerStudent');
      return false;
    }
    return true;
  }

  /**
   * verifica se o instrutor esta no limite de aulas simultaneas
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxSimultaneousLessonsPerInstructor(event): boolean {
    // horario de inicio e fim da aula a ser agendada
    const startDate = new Date(event.start.format());
    const endDate = new Date(event.end.format());
    // pega as aulas do instrutor selecionado no mesmo horario
    const instructorLessons = this.simulationLessonList.filter( el => {
        return el.instructorId == this.instructorId && (
          (el.startDate <= startDate && el.endDate >= startDate) ||
          (el.startDate <= endDate && el.endDate >= endDate)
        );
      } );
    if ( instructorLessons && instructorLessons.length >= this.system.maxSimultaneousLessonsPerInstructor ) {
      this.scheduleCalendar.setCalendar('removeEvents', event._id);
      this.alertMsg('maxSimultaneousLessonsPerInstructor', this.system.maxSimultaneousLessonsPerInstructor);
      return false;
    }
    return true;
  }

  /**
   * verifica se atingiu o maximo de aulas livres por dia
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxNumFreeLessonsPerDay(event): boolean {
    // tipo de aula
    const lessonType = getKeyByValue(this.txt.fields.lessonType.options, event.title);
    // se for adicionar uma aula livre
    if ( lessonType == 2 ) {
      // pega todas as aulas livres
      const freeClassLessons = this.simulationLessonList.filter( el => el.lessonType == 2 );
      if ( freeClassLessons && freeClassLessons.length >= this.system.maxNumFreeLessonsPerDay ) {
        this.scheduleCalendar.setCalendar('removeEvents', event._id);
        this.alertMsg('maxNumFreeLessonsPerDay', this.system.maxNumFreeLessonsPerDay);
        return false;
      }
    }
    return true;
  }

  /**
   * verifica se atingiu o maximo de aulas por dia para um mesmo aluno
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxNumLessonsPerDayPerStudent(event): boolean {
    // pega todas as aulas do aluno
    const studentLessons = this.simulationLessonList.filter( el => el.studentId == this.studentId );
    if ( studentLessons && studentLessons.length >= this.system.maxNumLessonsPerDayPerStudent ) {
      this.scheduleCalendar.setCalendar('removeEvents', event._id);
      this.alertMsg('maxNumLessonsPerDayPerStudent', this.system.maxNumLessonsPerDayPerStudent);
      return false;
    }
    return true;
  }

  /**
   * verifica se atingiu o numero maximo de aulas em sequencia para o mesmo aluno
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMaxNumLessonsInSequencePerStudent(event): boolean {
    // verifica se é uma sequencia
    const arrSequences = this.getSequence(event);
    // console.log('array de aulas', arrSequences);
    // verifica se a sequencia tem o tamanho maximo permitido
    if (arrSequences.length > this.system.maxNumLessonsInSequencePerStudent) {
      this.scheduleCalendar.setCalendar('removeEvents', event._id);
      this.alertMsg('maxNumLessonsInSequencePerStudent', this.system.maxNumLessonsInSequencePerStudent);
      return false;
    }
    return true;
  }

  /**
   * verifica o intervalo entre sequencias
   * @param  {[type]}  event evento da agenda
   * @return {boolean}       retorna true se passou no teste
   */
  private validateMinIntervalBetweenLessonsSequence(event): boolean {
    // verifica se é uma sequencia
    const arrSequences = this.getSequence(event);
    // se for uma sequencia
    if ( arrSequences.length > 1 ) {
      // procura alguma aula anterior (todas cujo endDate seja antes da primeira aula da sequencia)
      const beforeLessons = this.simulationLessonList.filter( el =>
        el.studentId == this.studentId &&
        (el.endDate as Date).getTime() < arrSequences[0].start.getTime()
      );
      // se encontrou 1 ou mais aulas, pega a mais proxima
      if ( beforeLessons.length >= 1 ) {
        const beforeLesson = beforeLessons.reduce(
          (beforeValue, actualValue) => (actualValue.endDate as Date).getTime() > (beforeValue.endDate as Date).getTime() ? actualValue : beforeValue
        );
        // verifica se a aula faz parte de uma sequencia
        const arrBeforeSequences = this.getSequence(beforeLesson);
        if ( arrBeforeSequences.length > 1 ) {
          // finalmente verifica o intervalo entre as 2 sequencias
          const minutes = (arrSequences[0].start.getTime() - arrBeforeSequences[ arrBeforeSequences.length - 1 ].end.getTime()) / 60 / 1000;
          if ( minutes < this.system.minIntervalBetweenLessonsSequence ) {
            this.scheduleCalendar.setCalendar('removeEvents', event._id);
            this.alertMsg('minIntervalBetweenLessonsSequence', this.system.minIntervalBetweenLessonsSequence);
            return false;
          }
        }
      }

      // procura alguma aula posterior (todas cujo startDate seja depois da ultima da sequencia)
      const afterLessons = this.simulationLessonList.filter( el =>
        el.studentId == this.studentId &&
        (el.startDate as Date).getTime() > arrSequences[ arrSequences.length -1 ].end.getTime()
      );
      // se encontrou 1 ou mais aulas, pega a mais proxima
      if ( afterLessons.length >= 1 ) {
        const afterLesson = afterLessons.reduce(
          (beforeValue, actualValue) => (actualValue.startDate as Date).getTime() < (beforeValue.startDate as Date).getTime() ? actualValue : beforeValue
        );
        // verifica se a aula faz parte de uma sequencia
        const arrAfterSequences = this.getSequence(afterLesson);
        if ( arrAfterSequences.length > 1 ) {
          // ate q enfim verifica o intervalo entre as 2 sequencias
          const minutes = (arrAfterSequences[0].start.getTime() - arrSequences[ arrSequences.length -1 ].end.getTime()) / 60 / 1000;
          if ( minutes < this.system.minIntervalBetweenLessonsSequence ) {
            this.scheduleCalendar.setCalendar('removeEvents', event._id);
            this.alertMsg('minIntervalBetweenLessonsSequence', this.system.minIntervalBetweenLessonsSequence);
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * retorna uma lista de objetos contendo a hora de inicio e fim da aula
   * pega todas as aulas antes e depois do evennto se forem sequenciais
   * @param  {[type]} event evento da agenda
   * @return {Array}        array de objetos contendo a hora de inicio e fim da aula
   */
  private getSequence(event): Array<{start:Date, end:Date}> {
    // pega todas as aulas do aluno
    const studentLessons = this.simulationLessonList.filter( el => el.studentId == this.studentId );
    if ( studentLessons ) {
      // array de aulas em sequencia
      let arrSequences = [];
      // inicializa o array com a aula adicionada
      arrSequences[0] = {start:event.startDate || new Date(event.start.format()), end:event.endDate || new Date(event.end.format())};
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
    return [{start:event.startDate || new Date(event.start.format()), end:event.endDate || new Date(event.end.format())}];
  }

  /**
   * alerta de erros
   * @param {string} keyMsg key da msg de erro
   */
  private alertMsg(keyMsg:string, value?:number|string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: new confirmDialogModel({
        text: this.txt.messages.scheduleAlert[keyMsg].replace('{n}',value),
        buttonCancel: this.txt.modal.buttons.close
      })
    });
  }

  /**
   * exbibe dialog para excluir
   * @param {number} id
   */
  public delete(id:number): void {

    this._delete(id, this.simulationLessonService);

  }
}
