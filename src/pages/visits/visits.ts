import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { VisitPage } from "../visit/visit";
// @IonicPage()
@Component({
  selector: 'page-visits',
  templateUrl: 'visits.html',
})
export class VisitsPage {
  enable_loader: boolean = true;
  visits = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitsPage');
    this.visits = this.api.visits;
    this.getVisits();
  }

  viewVisit(visit) {
    this.navCtrl.push(VisitPage, { visit: visit });
  }

  getVisits(loading = null) {
    this.api.get(`visits?with[]=visitor&with[]=user&with[]=visitors&where[residence_id]=${this.api.residence.id}}&limit=500&order[created_at]=desc`)
      .then((data: any) => {
        loading.complete()
        if (data.length == 0) {
          this.enable_loader = false;
        }
        this.visits = this.visits = data;
        if (loading)
          loading.complete()
      })
      .catch((err) => {
        console.error(err);
        if (loading)
          loading.complete()
      });
  }


  // Broke
  loadMoreVisits(infiniteScroll = null) {
    this.api.get(`visits?with[]=visitor&with[]=user&with[]=visitors&where[residence_id]=${this.api.residence.id}}&limit=500&order[created_at]=desc&whereGt[id]=${this.visits[0].id}`)
      .then((data: any) => {
        infiniteScroll.complete()
        if (data.length == 0) {
          this.enable_loader = false;
        }
        this.visits = this.visits.concat(data);
        if (infiniteScroll)
          infiniteScroll.complete()
      })
      .catch((err) => {
        console.error(err);
        if (infiniteScroll)
          infiniteScroll.complete()
      });
  }



}
