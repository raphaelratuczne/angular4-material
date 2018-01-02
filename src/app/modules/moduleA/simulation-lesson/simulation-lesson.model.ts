import { CommonModel } from 'app/shared';
import { System } from '../../moduleCf/system';

export class ScheduleLesson extends CommonModel {

  id?: number = null;
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  studentId: number = null;
  instructorId: number = null;
  moduleId: number = null;
  vehicleModelId: number = null;
  lessonType: number = null;

  // esses campos servem para enviar dados para o dialog
  companyId?: number;
  simulatorId?: number;
  lessonId?: number;
  drivingSchoolId?: number;
  drivingSchoolList?: Array<any>;
  studentList?: Array<any>;
  simulatorlist?: Array<any>;
  vehiclesList?: Array<any>;
  instructorList?: Array<any>;
  timeToAddOnEnd?: number;
  moduleList?: Array<any>;
  status?: number;
  simulationLessonList?: SimulationLesson[];
  system?: System;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

// /api/company/{companyId}/lesson/search/?date={timestamp}&getCanceled=false
// Serviço responsável por retornar todos as aulas ativas para uma determinada data.
export class SimulationLesson extends CommonModel {

  id: number = null;
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  status: number = null;
  studentId: number = null;
  studentName: string = null;
  instructorId: number = null;
  instructorName: string = null;
  moduleId: number = null;
  moduleDescription: string = null;
  companyId: number = null;
  companyTradingName: string = null;
  simulatorId: number = null;
  vehicleModelId: number = null;
  lessonType: number = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

// /api/company/{companyId}/student/pendingScheduling
// Serviço responsável por retornar todos os alunos com pendência de agendamentos de aulas.
export class StudentPendingScheduling extends CommonModel {

  id: number = null;
  enrollments: Enrollment[] = [];
  person: Person  = null;
  renach: any = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.person = new Person(this.person);
    if (this.enrollments.length > 0) {
      for (let i in this.enrollments) {
        this.enrollments[i] = new Enrollment(this.enrollments[i]);
      }
    }
  }
}

// /api/company/{companyId}/instructor/active/?lessonCategory=2
// Serviço responsável por retornar todos os instrutores ativos que possuem autorização para ministrar aulas em simuladores de veículos.
export class ActiveInstructor extends CommonModel {

  id: number = null;
  active: boolean = null;
  authPraticalLesson: boolean = null;
  authSimulatorLesson: boolean = null;
  authTheoricalLesson: boolean = null;
  person: Person = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.person = new Person(this.person);
  }
}

// /api/company/{companyId}/simulator/active/?date={timestamp}
// Serviço responsável por retornar todos os simuladores ativos para uma determinada data.
export class ActiveSimulator extends CommonModel {

  id: number = null;
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  company: Company = null;
  simulator: Simulator = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
  }
}

// /api/company/{companyId}/sharedunit
// Retorna dados do Centro Compartilhado caso a empresa seja Centro Compartilhado.
export class DrivingSchool {

  id: number = null;
  scheduleAccessEnabled: boolean = null;
  scheduleAccessReadOnly: boolean = null;
  company: Company = null;
  relatedDrivingSchools: Array<{id: number; company: Company;}> = [];

}

// /api/admin/module/softwareversion/{softwareVersionId}
// Recupera módulos de simulação de uma determinada versão de software.
export class Module extends CommonModel {

  id: number = null;
  description: string = null;
  exercises: Exercise[] = [];
  softwareVersion: SoftwareVersion = null;
  departmentCode: any = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
    for (let i in this.exercises) {
      this.exercises[i] = new Exercise(this.exercises[i]);
    }
  }
}

export class Enrollment extends CommonModel {

  id: number = null;
  lessonsCategory: number = null;
  lessonsType: number = null;
  numLessonsLoaded: number = null;
  departmentProcessNumber: string = null;
  paymentType: number = null;
  enrollmentDate: string|number|Date = null;
  status: number = null;
  totalValueOfContract: number = null;
  enabledToSchedule: boolean = null;
  simulationLessons: SimulationLesson[] = [];
  user: User = null;
  company: Company = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}


export class ScheduledLesson extends CommonModel {

  id: number = null;
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  status: number = null;
  exported: boolean = null;
  simulatorHistory: SimulatorHistory = null;
  simulationModule: SimulationModule = null;
  exercises: ScheduledLessonExercise[] = [];
  biometries: Array<any> = [];
  photos: Array<any> = [];
  instructor: Instructor = null;
  vehicleModel: VehicleModel = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.simulatorHistory = new SimulatorHistory(this.simulatorHistory);
    this.simulationModule = new SimulationModule(this.simulationModule);
    this.instructor = new Instructor(this.instructor);
    if (this.exercises.length > 0) {
      for (let i in this.exercises) {
        this.exercises[i] = new ScheduledLessonExercise(this.exercises[i]);
      }
    }
  }
}

export class Exercise extends CommonModel {

  id: number = null;
  code: number = null;
  description: string = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
  }
}

export class ScheduledLessonExercise extends CommonModel {

  id: number = null;
  averageSpeed: string|number = null;
  beginDate: string|number|Date = null;
  finishDate: string|number|Date = null;
  distance: string|number = null;
  maximumSpeed: string|number = null;
  simulationTime: string|number|Date = null;
  infractionOccurrences: Array<any> = [];
  performedActivities: Array<any> = [];
  eventOccurrences: Array<any> = [];
  simulationExercise: SimulationExercise = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.simulationExercise = new SimulationExercise(this.simulationExercise);
  }
}

export class Person extends CommonModel {

  id: number = null;
  birthDate: string|number|Date = null;
  cpf: string = null;
  cellPhoneNumber: string = null;
  email: string = null;
  name: string = null;
  phoneNumber: string = null;
  rg: string = null;
  rgExpeditionAgency: string = null;
  rgExpeditionDate: string|number|Date = null;
  address: string = null;
  gender: string = null;
  rgState: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export class Company {
  id: number = null;
  cnpj: string = null;
  name: string = null;
  tradingName: string = null;
  email: string = null;
  phoneNumber: string = null;
  stateModuleR: string = null;
  address: Address = null;
}

export class Address {
  id: number = null;
  cityArea: string = null;
  complement: string = null;
  number: string = null;
  street: string = null;
  zipcode: string = null;
  city: City = null;
}

export class City {
  id: number = null;
  name: string = null;
  state: State = null;
}

export class State {
  id: number = null;
  uf: string = null;
  name: string = null;
  timezone: number = null;
}

export class VehicleType {
  id: number;
  description: string;
}

export class Simulator {
  id: number;
  active: boolean;
  name: string;
  serialNumber: string;
  vehicleType: VehicleType;
}

export class SimulationSoftwareVersion extends CommonModel {

  id: number = null;
  description: string = null;
  version: string = null;
  releaseDate: string|number|Date = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export class SimulatorHistory extends CommonModel {

  id: number = null;
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  company: Company = null;
  simulator: Simulator = null;
  simulationSoftwareVersion: SimulationSoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.simulationSoftwareVersion = new SimulationSoftwareVersion(this.simulationSoftwareVersion);
  }
}

export class SimulationModule extends CommonModel {

  id: number = null;
  description: string = null;
  exercises: Exercise[] = [];
  softwareVersion: SoftwareVersion = null;
  departmentCode: any = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
    if (this.exercises.length > 0) {
      for (let i in this.exercises) {
        this.exercises[i] = new Exercise(this.exercises[i]);
      }
    }
  }
}

export class SoftwareVersion extends CommonModel {

  id: number = null;
  description: string = null;
  version: string = null;
  releaseDate: string|number|Date = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

export class SimulationExercise extends CommonModel {

  id: number = null;
  code: number = null;
  description: string = null;
  softwareVersion: SoftwareVersion = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.softwareVersion = new SoftwareVersion(this.softwareVersion);
  }
}

export class Instructor extends CommonModel {

  id: number = null;
  active: boolean = null;
  authPraticalLesson: boolean = null;
  authSimulatorLesson: boolean = null;
  authTheoricalLesson: boolean = null;
  person: Person = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.person = new Person(this.person);
  }
}

export class VehicleModel {
  id: number = null;
  description: string = null;
  vehicleType: VehicleType = null;
}

export class User {
  id: number = null;
  cpf: string = null;
  active: boolean = null;
  firstName: string = null;
  lastName: string = null;
  email: string = null;
  userTypeId: number = null;
}

export interface ScheduleCalendarEvent {
  id?: number;
  title: string;
  color: string;
  stick: boolean;
  duration: string;
  overlap: boolean;
  durationEditable: boolean;
}
