import { Api } from './../../providers/api';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
  selector: 'page-pet-editor',
  templateUrl: 'pet-editor.html',
})
export class PetsEditorPage {
  pet: any = {
    name: '',
    document: '',
    breed: '',
    specie: '',
    color: '',
    sex: 'male',
    extra: '',
    residence_id: this.api.user.residence_id
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    var pet = navParams.get('pet')
    console.log(pet)
    if (pet !== undefined)
      this.pet = {
        id: pet.id,
        name: pet.name,
        document: pet.document,
        breed: pet.breed,
        specie: pet.specie,
        sex: pet.sex,
        color: pet.color,
        extra: pet.extra,
        residence_id: pet.residence_id
      };

  }

  canSave() {
    return this.pet.name.length > 1 &&
      this.pet.breed.length > 1 &&
      this.pet.specie.length > 1
  }

  save() {
    var promise: Promise<any>;
    if (this.pet.id) {
      promise = this.api.put('pets/' + this.pet.id, this.pet);
    } else {
      promise = this.api.post('pets', this.pet);
    }
    promise.then((data) => {
      this.pet = data;
      this.dismiss();
    })
      .catch(console.error)
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
