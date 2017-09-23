import { Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";
import Chart from 'chart.js';
var funct
@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {
  survey: any;
  vote: any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public events: Events) {
    this.survey = navParams.get('survey');
  }

  ionViewDidLoad() {
    this.renderChart();
    this.getVote();
    funct = (data) => {
      this.update();
    }
    this.events.subscribe('survey:updated', funct)
  }
  ionViewWillUnload() {
    this.events.unsubscribe('survey:updated', funct)
  }
  surveyUpdated(data) {
    this.survey = data.survey;
    this.renderChart();
    this.getVote();
  }
  renderChart() {
    var ctx: any = (document.getElementById("surveyChart"))
    ctx = ctx.getContext("2d");
    new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: [
            this.survey.results[1],
            this.survey.results[2],
            this.survey.results[3],
            this.survey.results[4],
            this.survey.results[5],
            this.survey.results[6],
          ],
          backgroundColor: ['#2196F3', '#F44336', '#FFC107', '#4CAF50', '#9C27B0', '#E91E63',],
          label: this.api.trans('__.# of Votes'),
        }],
        labels: [
          this.survey.response_1,
          this.survey.response_2,
          this.survey.response_3,
          this.survey.response_4,
          this.survey.response_5,
          this.survey.response_6,
        ]
      },
      options: {
        responsive: true
      }
    })
  }
  setVote() {
    this.alert.create({
      title: this.survey.question,
      subTitle: this.survey.question,
      inputs: [
        {
          label: this.survey.response_1,
          type: 'radio',
          value: "1",
          name: "response",
          checked: true,
        },
        {
          label: this.survey.response_2,
          type: 'radio',
          value: "2",
          name: "response"
        },
        {
          label: this.survey.response_3,
          type: 'radio',
          value: "3",
          name: "response"
        },
        {
          label: this.survey.response_4,
          type: 'radio',
          value: "4",
          name: "response"
        },
        {
          label: this.survey.response_5,
          type: 'radio',
          value: "5",
          name: "response"
        },
        {
          label: this.survey.response_6,
          type: 'radio',
          value: "6",
          name: "response"
        },

      ],
      buttons: [
        {
          text: this.api.trans('literals.vote'),
          handler: (data) => {
            this.postVote(data);
          }
        },
        {
          text: this.api.trans('crud.cancel'),
          handler: (data) => { },
          role: 'cancel'
        }
      ]
    }).present();
  }
  getVote() {
    this.api.get(`votes?where[user_id]=${this.api.user.id}&where[survey_id]=${this.survey.id}`)
      .then((votes: any) => { this.vote = votes[0] })
      .catch((err) => { console.error(err) });
  }
  postVote(data) {
    if (!data) return;
    this.api.post('votes', { response: data, user_id: this.api.user.id, survey_id: this.survey.id })
      .then((data) => {
        console.log(data);
        this.vote = data;
        this.update();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  update() {
    this.api.get('surveys/' + this.survey.id)
      .then((survey) => {
        this.survey = survey;
        this.renderChart();
      })
      .catch((err) => {
        console.error(err);
      })
  }
}
