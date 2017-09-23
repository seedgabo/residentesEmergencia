import { Api } from './../../providers/api';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
    selector: 'page-vehicle-editor',
    templateUrl: 'vehicle-editor.html',
})
export class VehiclesEditorPage {
    vehicle: any = {
        make: '',
        plate: '',
        model: '',
        color: '',
        note: '',
        residence_id: this.api.user.residence_id
    }
    constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
        var vehicle = navParams.get('vehicle')
        if (vehicle !== undefined)
            this.vehicle = {
                id: vehicle.id,
                make: vehicle.make,
                model: vehicle.model,
                plate: vehicle.plate,
                color: vehicle.color,
                note: vehicle.note,
                residence_id: vehicle.residence_id
            };

        console.log(this.vehicle)
    }

    canSave() {
        return this.vehicle.model.length > 1 &&
            this.vehicle.plate.length > 1 &&
            this.vehicle.color.length > 1 &&
            this.vehicle.make.length > 1;
    }

    save() {
        var promise: Promise<any>;
        if (this.vehicle.id) {
            promise = this.api.put('vehicles/' + this.vehicle.id, this.vehicle);
        } else {
            promise = this.api.post('vehicles', this.vehicle);
        }
        promise.then((data) => {
            this.vehicle = data;
            this.dismiss();
        })
            .catch(console.error)
    }

    dismiss() {
        this.navCtrl.pop();
    }

}
