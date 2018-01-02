import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CommonService } from 'app/shared';
import { SimulationLesson } from './simulation-lesson.model';
import { ScheduleLesson } from './simulation-lesson.model';
import { StudentPendingScheduling } from './simulation-lesson.model';
import { ActiveInstructor } from './simulation-lesson.model';
import { ActiveSimulator } from './simulation-lesson.model';
import { DrivingSchool } from './simulation-lesson.model';
import { Module } from './simulation-lesson.model';

@Injectable()
export class SimulationLessonService extends CommonService {

  constructor(injector:Injector) {
    super(injector);

    // url do servico
    // Servico responsavel por retornar todos as aulas ativas para uma determinada data
    this.apiUrl = 'company/{companyId}/lesson/search/?date={timestamp}&getCanceled=false';
    // Servico responsavel por retornar todos os alunos com pendencia de agendamentos de aulas.
    this.apiUrl = ['students','company/{companyId}/student/pendingScheduling'];
    // Servico responsavel por retornar todos os instrutores ativos que possuem autorizacao para ministrar aulas em simuladores de veiculos.
    this.apiUrl = ['instructors','company/{companyId}/instructor/active/?lessonCategory=2'];
    // Servico responsavel por retornar todos os simuladores ativos para uma determinada data.
    this.apiUrl = ['simulators','company/{companyId}/simulator/active/?date='];
    // Servico responsavel por retornar o total de aulas pendentes para agendamento por tipo de aula.
    this.apiUrl = ['lessons','company/{companyId}/lesson/totalByType/?studentId='];
    // Retorna dados do Centro Compartilhado caso a empresa seja Centro Compartilhado.
    this.apiUrl = ['sharedUnit','company/{companyId}/sharedunit'];
    // Recupera módulos de simulação de uma determinada versão de software.
    this.apiUrl = ['modules','admin/module/softwareversion/'];
    // Efetua o agendamento de uma aula para um determinado simulador.
    this.apiUrl = ['addSchedule','company/{companyId}/lesson/simulator/'];
    // Efetua a atualização de agendamento de aula.
    this.apiUrl = ['editSchedule','company/{companyId}/lesson/'];
    // Cancela uma aula agendada
    this.apiUrl = ['cancelSchedule','company/{companyId}/lesson/{lessonId}/cancel'];
    // evento
    this.loadingEvent = 'moduleCf-simulation-lesson';
  }

  /**
   * solicita todas as aulas ativas para uma determinada data
   * @param {number}                          date  dia da busca
   * @return {Observable<SimulationLesson[]>}       objeto com os dados
   */
  public loadData(date:number): Observable<SimulationLesson[]> {

    return this._loadData(null, null, false, null, [/{companyId}|{timestamp}/g, s => (s == '{companyId}') ? this.authService.getSelectedCompany().id : date])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new SimulationLesson(obj);

          // converte datas
          obj.timestampToDate('startDate');
          obj.timestampToDate('endDate');

          // adiciona a lista
          objs.push(obj);
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita todos os alunos com pendência de agendamentos de aulas
   * @return {Observable<StudentPendingScheduling[]>} lista de alunos
   */
  public loadStudents(): Observable<StudentPendingScheduling[]> {

    return this._loadData('students', null, false, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new StudentPendingScheduling(obj);

          // adiciona a lista
          objs.push(obj);
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita todos os instrutores ativos que possuem autorização para ministrar aulas em simuladores de veículos.
   * @return {Observable<ActiveInstructor[]>} lista de instrutores
   */
  public loadInstructors(): Observable<ActiveInstructor[]> {

    return this._loadData('instructors', null, false, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new ActiveInstructor(obj);

          // adiciona a lista
          objs.push(obj);
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita todos os simuladores ativos para uma determinada data.
   * @param  {number}                        date dia da busca
   * @return {Observable<ActiveSimulator[]>}      lista de simuladores
   */
  public loadSimulators(date:number): Observable<ActiveSimulator[]> {

    return this._loadData('simulators', date, false, null, ['{companyId}', this.authService.getSelectedCompany().id])
      .map( res => {
        let objs = [];
        for (let obj of res) {
          obj = new ActiveSimulator(obj);

          // converte datas
          obj.timestampToDate('startDate');
          obj.timestampToDate('endDate');

          // adiciona a lista
          objs.push(obj);
        }

        // console.log(objs);
        return objs;
      } );

  }

  /**
   * solicita total de aulas pendentes para agendamento por tipo de aula
   * @param  {number}     studentId id do aluno
   * @return {Observable}           lista de quantidades de aulas
   */
  public loadLessons(studentId:number): Observable<{[id:number]:number}> {

    return this._loadData('lessons', studentId, false, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * solicita dados do Centro Compartilhado caso a empresa seja Centro Compartilhado.
   * @return {Observable<DrivingSchool>} dados do centro compartilhado com lista de cfcs
   */
  public loadDrivingSchool(): Observable<DrivingSchool> {

    return this._loadData('sharedUnit', null, false, null, ['{companyId}', this.authService.getSelectedCompany().id]);

  }

  /**
   * solicita dados do modulos de simulacao de uma determinada versao de software.
   * @return {Observable<Module[]>} lista de modulos
   */
  public loadModules(softwareVersionId:number): Observable<Module[]> {

    return this._loadData('modules', softwareVersionId, false);

  }

  /**
   * envia os dados
   * @param  {ScheduleLesson}     obj         objeto de dados
   * @param  {number}             simulatorId id do simulador
   * @param  {number}             companyId   id da empresa (se for um centro compartilhado, deve passar o id da cfc selecionado)
   * @return {Observable<boolean>}            resposta do servidor
   */
  public sendData(obj:ScheduleLesson, simulatorId:number, companyId?:number): Observable<boolean> {

    // objeto de dados
    obj = new ScheduleLesson({
      startDate: obj.startDate,
      endDate: obj.endDate,
      studentId: obj.studentId,
      instructorId: obj.instructorId,
      moduleId: obj.moduleId,
      vehicleModelId: obj.vehicleModelId,
      lessonType: obj.lessonType
    });

    // converte datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');

    // id da empresa/cfc
    companyId = companyId || this.authService.getSelectedCompany().id;

    return this._sendData(obj, 'addSchedule', simulatorId, null, ['{companyId}', companyId]);

  }

  /**
   * altera dados
   * @param  {ScheduleLesson}     obj       objeto de dados
   * @param  {number}             companyId id da empresa (se for um centro compartilhado, deve passar o id da cfc selecionado)
   * @return {Observable<boolean>}          resposta do servidor
   */
  public editData(obj:ScheduleLesson, companyId?:number): Observable<boolean> {

    obj = new ScheduleLesson(obj);
    // converte datas
    obj.dateToTimestamp('startDate');
    obj.dateToTimestamp('endDate');

    // id da empresa/cfc
    companyId = companyId || this.authService.getSelectedCompany().id;

    return this._editData(obj, 'editSchedule', obj.id, null, ['{companyId}', companyId]);

  }

  /**
   * exclui dados
   * @param  {number}          id id do item
   * @return {Observable<boolean>}    resposta do servidor
   */
  public deleteData(id:number): Observable<boolean> {

    // return this._deleteData(id, null, null, ['{companyId}',this.authService.getSelectedCompany().id]);
    return this._editData(null, 'cancelSchedule', null, null, [/{companyId}|{lessonId}/g, s => (s == '{companyId}') ? this.authService.getSelectedCompany().id : id]);

  }

}
