import { Api } from './../../providers/api';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
  selector: 'page-worker-editor',
  templateUrl: 'worker-editor.html',
})
export class WorkersEditorPage {
  worker: any = {
    name: '',
    document: '',
    work: '',
    sex: '',
    extra: '',
    residence_id: this.api.user.residence_id
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    var worker = navParams.get('worker')
    console.log(worker)
    if (worker !== undefined)
      this.worker = {
        id: worker.id,
        name: worker.name,
        document: worker.document,
        work: worker.work,
        sex: worker.sex,
        extra: worker.extra,
        residence_id: worker.residence_id
      };

  }

  canSave() {
    return this.worker.name.length > 1 &&
      this.worker.document.length > 1 &&
      this.worker.work.length > 1
  }

  save() {
    var promise: Promise<any>;
    if (this.worker.id) {
      promise = this.api.put('workers/' + this.worker.id, this.worker);
    } else {
      promise = this.api.post('workers', this.worker);
    }
    promise.then((data) => {
      this.worker = data;
      this.dismiss();
    })
      .catch(console.error)
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
