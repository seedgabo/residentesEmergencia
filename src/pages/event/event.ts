import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  event: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.event = navParams.get('event');
  }

  ionViewDidLoad() {
    this.api.get('events/' + this.event.id + "?with[]=zones&with[]=creator")
      .then((data) => {
        this.event = data;
      }).catch((err) => {
        console.error(err);
      });
  }

}
