import { ToastController, ActionSheetController } from 'ionic-angular';
import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PetsEditorPage } from "../pet-editor/pet-editor";
@Component({
  selector: 'page-pets',
  templateUrl: 'pets.html',
})
export class PetsPage {
  pet_image: any;
  query = ""
  pets = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toast: ToastController, public actionsheet: ActionSheetController) {
    this.pets = this.api.residence.pets;
  }
  ionViewDidEnter() {
    this.getData()
  }

  getData() {
    this.api.get('pets?where[residence_id]=' + this.api.user.residence_id)
      .then((data: any) => { this.api.pets = data; this.filter() })
      .catch(console.error)
  }

  filter() {
    if (this.query == "")
      return this.pets = this.api.pets;
    this.pets = this.api.pets.filter((pet) => {
      if (pet.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1
        || pet.document.toLowerCase().indexOf(this.query.toLowerCase()) > -1
      )
        return true;
      return false;
    });
  }

  addpet() {
    this.navCtrl.push(PetsEditorPage);
  }

  updatepet(pet) {
    this.navCtrl.push(PetsEditorPage, { pet: pet });
  }

  delete(pet) {
    this.api.delete('pets/' + pet.id)
      .then((data) => {
        this.getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }


  actions(pet) {
    this.actionsheet.create({
      title: this.api.trans('literals.actions') + " | " + pet.name,
      buttons: [
        {
          text: this.api.trans('crud.edit'),
          icon: 'create',
          cssClass: 'icon-secondary',
          handler: () => { this.updatepet(pet) }
        },
        {
          text: this.api.trans('crud.edit') + " " + this.api.trans('literals.image'),
          icon: 'camera',
          cssClass: 'icon-purple',
          handler: () => { this.askFile(pet) }
        },
        {
          text: this.api.trans('crud.delete'),
          icon: 'trash',
          role: 'destructive',
          cssClass: 'icon-danger',
          handler: () => { this.delete(pet) }
        }

      ]
    }).present();
  }


  askFile(pet) {
    this.pet_image = pet;
    var filer: any = document.querySelector("#input-file-pet")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.pet_image.image_url = result.target.result;
        this.uploadImage(this.pet_image.id)
      };
    } catch (error) {
      console.error(error)
    }
  }

  uploadImage(id) {
    return this.api.post('images/upload/pet/' + id, { image: this.pet_image.image_url })
      .then((data: any) => {
        console.log(data);
        this.pet_image.image = data.image;
        this.toast.create({
          message: this.api.trans("literals.image") + " " + this.api.trans("crud.updated"),
          duration: 1500,
          showCloseButton: true,
        }).present();
      })
      .catch(console.error)
  }

}




