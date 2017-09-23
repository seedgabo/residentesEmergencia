import { WorkersPage } from './../workers/workers';
import { VehiclesPage } from './../vehicles/vehicles';
import { VisitorsPage } from './../visitors/visitors';
import { PetsPage } from './../pets/pets';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-tables',
  templateUrl: 'tables.html',
})
export class TablesPage {
  VisitorsPage = VisitorsPage;
  VehiclesPage = VehiclesPage;
  WorkersPage = WorkersPage;
  PetsPage = PetsPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablesPage');
  }

}
