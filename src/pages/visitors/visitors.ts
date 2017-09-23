import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController, ToastController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { NewVisitorPage } from "../new-visitor/new-visitor";
import { CreateVisitPage } from "../create-visit/create-visit";
// @IonicPage()
@Component({
  selector: 'page-visitors',
  templateUrl: 'visitors.html',
})
export class VisitorsPage {
  visitor_image: any;
  query = "";
  visitors = [];
  selecteds = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController, public toast: ToastController) {
  }

  ionViewDidLoad() {
    this.visitors = this.api.visitors;
  }

  ionViewDidEnter() {
    this.selecteds = [];
    this.visitors.forEach((v) => {
      v.selected = false;
    })
  }

  addVisitor() {
    this.modal.create(NewVisitorPage, {}, { showBackdrop: true, enableBackdropDismiss: true }).present();
  }

  updateVisitor(visitor) {
    this.modal.create(NewVisitorPage, { visitor: visitor }, { showBackdrop: true, enableBackdropDismiss: true }).present();
  }

  filter() {
    if (this.query == "")
      return this.visitors = this.api.visitors;
    this.visitors = this.api.visitors.filter((visitor) => {
      if (visitor.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1 || visitor.document.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        return true;
      return false;
    });
  }

  toggleSelect(visitor) {
    if (visitor.selected) {
      visitor.selected = false
      this.selecteds.splice(this.selecteds.indexOf(visitor), 1);
    } else {
      visitor.selected = true
      this.selecteds.push(visitor);
    }
  }

  addVisit(visitor) {
    var modal = this.modal.create(CreateVisitPage, { visitor: visitor }, { showBackdrop: true, enableBackdropDismiss: true })
    modal.present();
    modal.onDidDismiss(() => {
      this.ionViewDidEnter();
    })

  }

  delete(visitor) {
    this.api.delete('visitors/' + visitor.id).catch((err) => {
      console.error(err);
    });
  }

  actions(visitor) {
    this.actionsheet.create({
      title: this.api.trans('literals.actions') + " | " + visitor.name,
      buttons: [
        {
          text: this.api.trans('__.Seleccionar para visita multiple'),
          icon: 'checkmark-circle',
          cssClass: 'icon-favorite',
          handler: () => { this.toggleSelect(visitor) }
        },
        {
          text: this.api.trans('literals.generate') + " " + this.api.trans('literals.visit'),
          icon: 'person-add',
          cssClass: 'icon-primary',
          handler: () => { this.addVisit(visitor) }
        },
        {
          text: this.api.trans('crud.edit'),
          icon: 'create',
          cssClass: 'icon-secondary',
          handler: () => { this.updateVisitor(visitor) }
        },
        {
          text: this.api.trans('crud.edit') + " " + this.api.trans('literals.image'),
          icon: 'camera',
          cssClass: 'icon-purple',
          handler: () => { this.askFile(visitor) }
        },
        {
          text: this.api.trans('crud.delete'),
          icon: 'trash',
          role: 'destructive',
          cssClass: 'icon-danger',
          handler: () => { this.delete(visitor) }
        }

      ]
    }).present();
  }

  askFile(visitor) {
    this.visitor_image = visitor;
    var filer: any = document.querySelector("#input-file")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.visitor_image.image_url = result.target.result;
        this.uploadImage(this.visitor_image.id)
      };
    } catch (error) {
      console.error(error)
    }
  }

  uploadImage(id) {
    return this.api.post('images/upload/visitor/' + id, { image: this.visitor_image.image_url })
      .then((data: any) => {
        console.log(data);
        this.visitor_image.image = data.image;
        this.toast.create({
          message: this.api.trans("literals.image") + " " + this.api.trans("crud.updated"),
          duration: 1500,
          showCloseButton: true,
        }).present();
      })
      .catch(console.error)
  }

}
