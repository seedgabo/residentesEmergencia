import { EventsPage } from './../events/events';
import { ProfilePage } from './../profile/profile';
import { InvoicesPage } from './../invoices/invoices';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { PostsPage } from "../posts/posts";
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
  constructor(public navCtrl: NavController, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.startEcho();
    this.getSliders();
    this.getNextEvents()
    this.getNews();
  }

  getSliders() {
    this.api.storage.get('sliders').then((sliders) => {
      if (sliders)
        this.sliders = sliders;
      this.api.get("sliders?with[]=image")
        .then((data: any) => {
          this.api.storage.set('sliders', data);
          console.log(data);
          this.sliders = data;
        })
        .catch((error) => {
          console.error("error trayendo los sliders:", error);
        });
    });

  }
  getNextEvents() {
    this.api.get('events?scope[soon]')
      .then((data: any) => {
        this.nextEvents = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getNews() {
    this.api.get('posts?order[created_at]=desc&limit=7&with[]=user.residence&with[]=image')
      .then((data: any) => {
        console.log("news", data);
        this.news = data;
      })
      .catch((err) => {
      });
  }
  gotoNews() {
    this.navCtrl.push(PostsPage);
  }
  gotoInvoices() {
    this.navCtrl.push(InvoicesPage)
  }
  gotoProfile() {
    this.navCtrl.push(ProfilePage);
  }
  gotoCalendar(event) {
    this.navCtrl.push(EventsPage, { event: event });
  }

}

