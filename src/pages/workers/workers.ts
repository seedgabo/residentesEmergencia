import { ToastController, ActionSheetController } from 'ionic-angular';
import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WorkersEditorPage } from "../worker-editor/worker-editor";
@Component({
  selector: 'page-workers',
  templateUrl: 'workers.html',
})
export class WorkersPage {
  worker_image: any;
  query = ""
  workers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toast: ToastController, public actionsheet: ActionSheetController) {
    this.workers = this.api.residence.workers;
  }
  ionViewDidEnter() {
    this.getData()
  }

  getData() {
    this.api.get('workers?where[residence_id]=' + this.api.user.residence_id)
      .then((data: any) => { this.api.workers = data; this.filter() })
      .catch(console.error)
  }

  filter() {
    if (this.query == "")
      return this.workers = this.api.workers;
    this.workers = this.api.workers.filter((worker) => {
      if (worker.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        return true;
      return false;
    });
  }

  addworker() {
    this.navCtrl.push(WorkersEditorPage);
  }

  updateworker(worker) {
    this.navCtrl.push(WorkersEditorPage, { worker: worker });
  }

  delete(worker) {
    this.api.delete('workers/' + worker.id)
      .then((data) => {
        this.getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }


  actions(worker) {
    this.actionsheet.create({
      title: this.api.trans('literals.actions') + " | " + worker.name,
      buttons: [
        {
          text: this.api.trans('crud.edit'),
          icon: 'create',
          cssClass: 'icon-secondary',
          handler: () => { this.updateworker(worker) }
        },
        {
          text: this.api.trans('crud.edit') + " " + this.api.trans('literals.image'),
          icon: 'camera',
          cssClass: 'icon-purple',
          handler: () => { this.askFile(worker) }
        },
        {
          text: this.api.trans('crud.delete'),
          icon: 'trash',
          role: 'destructive',
          cssClass: 'icon-danger',
          handler: () => { this.delete(worker) }
        }

      ]
    }).present();
  }


  askFile(worker) {
    this.worker_image = worker;
    var filer: any = document.querySelector("#input-file-worker")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.worker_image.image_url = result.target.result;
        this.uploadImage(this.worker_image.id)
      };
    } catch (error) {
      console.error(error)
    }
  }

  uploadImage(id) {
    return this.api.post('images/upload/worker/' + id, { image: this.worker_image.image_url })
      .then((data: any) => {
        console.log(data);
        this.worker_image.image = data.image;
        this.toast.create({
          message: this.api.trans("literals.image") + " " + this.api.trans("crud.updated"),
          duration: 1500,
          showCloseButton: true,
        }).present();
      })
      .catch(console.error)
  }

}




