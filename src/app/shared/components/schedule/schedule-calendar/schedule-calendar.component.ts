import { Component, ElementRef, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import 'fullcalendar';

@Component({
  selector: 'lk-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: [
    './schedule-calendar.component.scss'
  ]
})
export class ScheduleCalendarComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() options: any;
  @Input() eventsList: any;

  private nativeElement: any;
  private jqueryElement: JQuery;
  private calendar: any;

  constructor(public elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
    this.jqueryElement = $(this.nativeElement);
  }

  ngOnDestroy() {
    this.calendar = null;
    this.nativeElement.remove();
  }

  ngOnChanges() {
    this.buildCalendar();
  }

  ngAfterViewInit() {
    this.buildCalendar();

    // let i = 6;
    // eventos de arrastar
    // this.jqueryElement.find('.draggable').each(function(){
    //   console.log('aqui1');
    //   $(this).data('event', {
		// 		title: 'evento teste ' + (i++),
    //     id: i,
		// 		stick: true,
    //     duration: '01:00',
    //     overlap: false,
    //     durationEditable: false
		// 	});
    //   $(this)['draggable']({
		// 		zIndex: 999,
		// 		revert: true,      // will cause the event to go back to its
		// 		revertDuration: 0  //  original position after the drag
		// 	});
    // });
  }

  private buildCalendar() {
    this.jqueryElement.find('.schedule-calendar-container').fullCalendar(this.options);
  }

  public setCalendar(event:string, options?:any, flag?:boolean) {
    this.jqueryElement.find('.schedule-calendar-container').fullCalendar(event, options, flag);
  }

  // public addEvent(event) {
  //   console.log('add evento fixo', event);
  //   this.jqueryElement.find('.schedule-calendar-container').fullCalendar('renderEvent', event, true);
  // }

  // public addEventDay(event) {
  //   console.log('add evento no dia', event);
  //   this.jqueryElement.find('.schedule-calendar-container').fullCalendar('renderEvent', event, false);
  // }

  // public addResource(resource) {
  //   console.log('adiciona simulador', resource);
  //   this.jqueryElement.find('.schedule-calendar-container').fullCalendar('addResource', resource);
  // }

  // public setConfig(config) {
  //   console.log('seta configuracoes', config);
  //   this.jqueryElement.find('.schedule-calendar-container').fullCalendar('option', config);
  // }

  // public goToDate(date) {
  //   console.log('vai para a data', date);
  //   this.jqueryElement.find('.schedule-calendar-container').fullCalendar('gotoDate', date);
  // }

  public setDraggable() {
    this.jqueryElement.find('.draggable').each(function(){
      $(this)['draggable']({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
    });
  }

  public tojson(obj): string {
    return JSON.stringify({
      	title: obj.title,
      	stick: obj.stick,
        duration: obj.duration,
        overlap: obj.overlap,
        durationEditable: obj.durationEditable
    });
  }

}
