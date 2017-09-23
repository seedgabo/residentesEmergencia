import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
@Component({
  selector: 'page-add-chat',
  templateUrl: 'add-chat.html',
})
export class AddChatPage {
  residences = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.navParams.get('residences');
  }

  ionViewDidLoad() {

  }

  createChat(residence) {
    this.api.post('messages/' + residence.id, {})
      .then((data: any) => {
        console.log(data)
        this.close(data.thread);
      })
      .catch(console.error)
  }

  close(thread = null) {
    this.viewctrl.dismiss(thread);
  }

}
