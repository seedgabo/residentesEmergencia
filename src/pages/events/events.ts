import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Api } from "../../providers/api";
import { AddEventPage } from "../add-event/add-event";
import { EventPage } from "../event/event";
declare var $: any;
declare var moment: any;
moment.locale('es');
// @IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  calendarOptions
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public events: Events) {
  }

  ionViewDidLoad() {
    var ev = this.navParams.get('event')
    this.getEvents(null, ev);
    this.events.subscribe("events:changed", () => {
      this.getEvents();
    })
  }

  getEvents(refresher = null, event = null) {
    this.api.get('events?take=200&afterEach[toCalendar]=null')
      .then((data: any) => {
        console.log(data);
        this.api._events = data;
        this._renderCalendar();
        if (refresher != null) {
          refresher.complete();
        }
        if (event !== null) {
          this.event(event);
        }
      })
      .catch((err) => {
        if (refresher != null) {
          refresher.complete();
        }
        console.error(err);
      });
  }

  _renderCalendar() {
    $("#calendar").fullCalendar({
      events: this.api._events,
      height: "parent",
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay'
      },
      locale: 'es',
      eventClick: (calEvent, jsEvent, view) => {
        this.event(calEvent);
      }
    });
  }

  event(ev) {
    console.log(ev);
    this.navCtrl.push(EventPage, { event: ev });
  }

  addEvent() {
    this.navCtrl.push(AddEventPage, {});
  }

}
