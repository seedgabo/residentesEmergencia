import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import moment from 'moment';
@Component({
  selector: 'page-zone-reservation',
  templateUrl: 'zone-reservation.html',
})
export class ZoneReservationPage {
  zone;
  date;
  options = []
  collection = {}
  reservations = [];
  loading = true
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController) {
    this.zone = navParams.get('zone')
    this.date = navParams.get('date')
  }

  ionViewDidLoad() {
    this.loading = true
    console.log(this.zone);
    this.buildList();
    this.getReservations()
  }

  buildList() {
    this.options = [];
    var time = moment(this.zone.start, "HH:mm");
    var end = moment(this.zone.end, "HH:mm");

    if (this.zone.start == null)
      time = moment().startOf('day')
    if (this.zone.end == null)
      end = moment().startOf('day').add(23, 'hours')

    console.log(time, end)

    if (time < end && this.zone.interval > 0)
      do {
        var ref = {
          available: this.zone.limit_user == 0 ? Number.MAX_SAFE_INTEGER : this.zone.limit_user,
          limit_user: this.zone.limit_user,
          time: time.clone(),
          ref: time.clone().format("HH:mm")
        }
        this.options[this.options.length] = ref
        this.collection["" + time.clone().format("HH:mm")] = ref
        time = time.add(this.zone.interval, 'm')
      } while (time <= end)
  }

  getReservations() {
    this.api.get(`reservations?where[zone_id]=${this.zone.id}&whereDateBetween[start]=${this.date.format("YYYY-MM-DD")},${this.date.clone().add(1, 'd').format("YYYY-MM-DD")}`)
      .then((data: any) => {
        this.reservations = data;
        console.log(data);
        data.forEach(reservation => {
          var ref = moment.utc(reservation.start).format("HH:mm")
          console.log(this.collection[ref])
          this.collection[ref].available -= reservation.quotas;
          if (reservation.user_id === this.api.user.id) {
            this.collection[ref].reserved = true
            this.collection[ref].reservation = reservation
          }
        });
        this.loading = false
      })
      .catch(console.error)
  }

  reservate(interval) {
    if (interval.reserved) {
      return this.viewReservation(interval)
    }
    var alert = this.alert.create({
      title: this.api.trans('literals.reservation') + " " + this.zone.name,
      message: this.api.trans("__.elija la cantidad de personas"),
      inputs: [
        {
          max: parseInt(interval.available),
          min: 1,
          value: "1",
          type: "number",
          label: this.api.trans("literals.quotas"),
          placeholder: this.api.trans("literals.quotas"),
          name: "quotas"
        }
      ],
      buttons: [
        {
          text: this.api.trans('crud.cancel'),
          role: "cancel"
        },
        {
          cssClass: "secondary",
          text: this.api.trans('literals.reservate'),
          handler: (data) => {
            if (data.quotas > 0)
              this.postReservation(interval, data.quotas)
          }
        },
      ]
    })
    alert.present()
  }

  viewReservation(interval) {
    var alert = this.alert.create({
      title: this.api.trans('literals.reservation') + " " + this.zone.name,
      subTitle: this.api.trans('literals.quotas') + ": " + interval.reservation.quotas,
      message: this.api.trans('literals.user') + ": " + this.api.user.name,
      buttons: [
        {
          text: "OK"
        },
        {
          text: this.api.trans("crud.cancel") + " " + this.api.trans("literals.reservation"),
          role: "destructive",
          handler: () => {
            this.alert.create({ message: "no disponible aun" }).present()
          }

        }
      ]
    })
    alert.present();
  }

  postReservation(interval, quotas) {
    this.api.post('reservations',
      {
        quotas: quotas,
        zone_id: this.zone.id,
        user_id: this.api.user.id,
        start: this.date.format("YYYY-MM-DD") + " " + interval.time.format("HH:mm"),
        end: this.date.format("YYYY-MM-DD") + " " + interval.time.clone().add(this.zone.interval, "m").format("HH:mm")
      })
      .then((data) => {
        console.log(data);
        this.ionViewDidLoad();
      })
      .catch(console.error)
  }

}
