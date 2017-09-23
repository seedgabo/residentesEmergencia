import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";


@Component({
  selector: 'page-residences',
  templateUrl: 'residences.html',
})
export class Residences {
  residences: any=[];
  


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public api: Api) {

  }

  ionViewDidLoad() {
    console.log('ya me carge: Residences');
    this.getResidences();
  }
  getResidences() {

    this.api.get("residences?with[]=owner")
      .then((data: any) => {
        console.log(data);
        this.residences = data;
      })
      .catch((err) => {
        console.error(err);
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: 'Ups ocurrio un error al traer datos',
          buttons: ['OK']
        });
        alert.present();

      })
  }
}
  



