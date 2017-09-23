import { ToastController, ActionSheetController } from 'ionic-angular';
import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VehiclesEditorPage } from "../vehicle-editor/vehicle-editor";
@Component({
  selector: 'page-vehicles',
  templateUrl: 'vehicles.html',
})
export class VehiclesPage {
  vehicle_image: any;
  query = ""
  vehicles = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public toast: ToastController, public actionsheet: ActionSheetController) {
    this.vehicles = this.api.residence.vehicles;
  }
  ionViewDidEnter() {
    this.getData()
  }

  getData() {
    this.api.get('vehicles?where[residence_id]=' + this.api.user.residence_id)
      .then((data: any) => { this.api.vehicles = data; this.filter() })
      .catch(console.error)
  }

  filter() {
    if (this.query == "")
      return this.vehicles = this.api.vehicles;
    this.vehicles = this.api.vehicles.filter((vehicle) => {
      if (vehicle.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1 || vehicle.plate.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        return true;
      return false;
    });
  }

  addVehicle() {
    this.navCtrl.push(VehiclesEditorPage);
  }

  updateVehicle(vehicle) {
    this.navCtrl.push(VehiclesEditorPage, { vehicle: vehicle });
  }

  delete(vehicle) {
    this.api.delete('vehicles/' + vehicle.id)
      .then((data) => {
        this.getData();
      })
      .catch((err) => {
        console.error(err);
      });
  }


  actions(vehicle) {
    this.actionsheet.create({
      title: this.api.trans('literals.actions') + " | " + vehicle.name,
      buttons: [
        {
          text: this.api.trans('crud.edit'),
          icon: 'create',
          cssClass: 'icon-secondary',
          handler: () => { this.updateVehicle(vehicle) }
        },
        {
          text: this.api.trans('crud.edit') + " " + this.api.trans('literals.image'),
          icon: 'photo',
          cssClass: 'icon-purple',
          handler: () => { this.askFile(vehicle) }
        },
        {
          text: this.api.trans('crud.delete'),
          icon: 'trash',
          role: 'destructive',
          cssClass: 'icon-danger',
          handler: () => { this.delete(vehicle) }
        }

      ]
    }).present();
  }


  askFile(vehicle) {
    this.vehicle_image = vehicle;
    var filer: any = document.querySelector("#input-file-vehicle")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.vehicle_image.image_url = result.target.result;
        this.uploadImage(this.vehicle_image.id)
      };
    } catch (error) {
      console.error(error)
    }
  }

  uploadImage(id) {
    return this.api.post('images/upload/vehicle/' + id, { image: this.vehicle_image.image_url })
      .then((data: any) => {
        console.log(data);
        this.vehicle_image.image = data.image;
        this.toast.create({
          message: this.api.trans("literals.image") + " " + this.api.trans("crud.updated"),
          duration: 1500,
          showCloseButton: true,
        }).present();
      })
      .catch(console.error)
  }

}




