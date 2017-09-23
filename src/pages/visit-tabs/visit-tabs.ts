import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VisitorsPage } from "../visitors/visitors";
import { VisitsPage } from "../visits/visits";
@Component({
  selector: 'page-visit-tabs',
  templateUrl: 'visit-tabs.html'
})
// @IonicPage()
export class VisitTabsPage {

  visitorsRoot = VisitorsPage
  visitsRoot = VisitsPage


  constructor(public navCtrl: NavController) { }

}
