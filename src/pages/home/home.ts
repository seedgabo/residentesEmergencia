import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Api } from "../../providers/api";
// import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  sliders = [];
  text = "";
  nextEvents = [];
  news = [];
  constructor(public navCtrl: NavController, public events: Events, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.startEcho();
  }
  panic() {
    this.api.panic();
  }
  logout() {
    this.events.publish('logout', {});
  }
}

