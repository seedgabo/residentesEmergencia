import { ZoneReservationPage } from './../zone-reservation/zone-reservation';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { DatePickerDirective } from 'datepicker-ionic2';
import moment from 'moment'

@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  @ViewChild(DatePickerDirective) datepickerDirective: DatePickerDirective;
  zones = [];
  reservations = [];
  selected;
  date = moment.utc().add(1, 'day').toDate() //.format('YYYY-MM-DD')
  today = moment.utc()
  min = moment.utc().startOf('day').toDate() //.format('YYYY-MM-DD')
  max = moment.utc().startOf('day').add(1, 'year').toDate() //.format('YYYY-MM-DD')
  locale = { monday: false, weekdays: moment.weekdaysShort(), months: moment.months() }
  disabledDates = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {

  }

  ionViewDidLoad() {
    this.getReservations();
    this.getZones();
  }

  getReservations() {
    this.api.get('reservations?where[user_id]=' + this.api.user.id)
      .then((data: any) => { this.reservations = data })
      .catch(console.error)
  }

  getZones() {
    this.api.get('zones?scope[reservable]=')
      .then((data: any) => { this.zones = data; console.log("zones:", data) })
      .catch(console.error)
  }

  humanize(interval) {
    if (interval === "60" || interval === 60) {
      return "1 hora";
    } else if (interval === "90" || interval === 90) {
      return "1 hora y media";
    } else if (interval === "180" || interval === 180) {
      return "2 horas";
    } else if (interval === "360" || interval === 360) {
      return "6 horas";
    } else if (interval === "720" || interval === 720) {
      return "12 horas";
    } else if (interval === "1440" || interval === 1440) {
      return "24 horas";
    } else {
      return interval + " " + "minutos";
    }
  }

  reservate(zone) {
    this.selected = zone
    this.disabledDates = this.getDisabledDays(this.selected.days);
    setTimeout(() => {
      this.datepickerDirective.open()
    }, 200)
  }

  setDate(ev, zone) {
    var date = moment.utc(ev)
    this.navCtrl.push(ZoneReservationPage, { zone: zone, date: date }, { animation: 'ios-transition' })
  }



  getDisabledDays(availables_days) {
    var notDays = this.arr_diff(availables_days, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
    var disabledDates = []
    notDays.forEach((day) => {
      disabledDates = disabledDates.concat(
        this.getDaysBetweenDates(
          this.min, this.max, day
        )
      )
    })
    console.log(disabledDates)
    return disabledDates;
  }

  getDaysBetweenDates(start, end, dayName) {
    var result = [];
    var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var day = days[dayName.toLowerCase().substr(0, 3)];
    // Copy start date
    var current = moment(start).clone();
    var _end = moment(end).clone();

    while (current.day(7 + day).isBefore(_end)) {
      result.push(current.toDate());
    }
    return result;
  }

  arr_diff(a1, a2) {
    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  }
}
