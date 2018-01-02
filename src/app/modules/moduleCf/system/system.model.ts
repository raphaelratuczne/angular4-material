import { CommonModel } from 'app/shared';

export class System extends CommonModel {
  externalAccessUrl: string = null;
  scheduleOpenTime: number | Date = null;
  scheduleCloseTime: number | Date = null;
  scheduleTimeDivision: number = null;
  lessonScheduler: number | boolean = null;
  officialLessonTotalTime: number = null;
  officialLessonEffectiveTime: number = null;
  freeLessonTotalTime: number = null;
  freeLessonEffectiveTime: number = null;
  maxNumFreeLessonsPerDay: number = null;
  maxNumLessonsPerDayPerStudent: number = null;
  maxNumLessonsInSequencePerStudent: number = null;
  minIntervalBetweenLessonsSequence: number = null;
  maxSimultaneousLessonsPerInstructor: number = null;
  maxSizeAttachment: number = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}
