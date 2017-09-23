import { Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { SurveyPage } from "../survey/survey";
var func
@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {
  surveys = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public events: Events) {
  }

  ionViewDidLoad() {
    this.getSurveys();
    func = (data) => {
      this.getSurveys(data)
    }
    this.events.subscribe('survey:created', func)
    this.events.subscribe('survey:updated', func)
    this.events.subscribe('survey:deleted', func)
  }
  ionViewDidEnter() {
    this.getSurveys();

  }

  ionViewDidLeave() {
    this.events.unsubscribe('survey:created', func)
    this.events.unsubscribe('survey:updated', func)
    this.events.unsubscribe('survey:deleted', func)
  }

  getSurveys(refresher = null) {
    this.api.get('surveys?take=50&orderBy[close_time]=desc')
      .then((data: any) => {
        console.log(data);
        this.surveys = data;
        if (refresher && typeof refresher.complete === 'function')
          refresher.complete()
      })
      .catch((err) => {
        console.error(err);
        if (refresher && typeof refresher.complete === 'function')
          refresher.complete()
      });

  }

  gotoSurvey(survey) {
    this.navCtrl.push(SurveyPage, { survey: survey });
  }

}
