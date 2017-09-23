import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Events } from 'ionic-angular';
import { HomePage } from "../home/home";
import { Api } from "../../providers/api";
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  forgot = false;
  ready = false;
  servers = {};
  code = "";
  constructor(public facebook: Facebook, public google: GooglePlus, public navCtrl: NavController, public navParams: NavParams, public api: Api, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public events: Events) {
  }

  ionViewDidLoad() {
    this.getServers();
  }

  verifyCode() {
    if (this.servers[this.code] !== undefined) {
      var server = this.servers[this.code]
      this.api.url = server.url;
      this.api.storage.set('url', server.url);
    }
  }
  goBack() {
    this.api.url = null;
    this.api.storage.remove('url');
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });

    loading.present();
    this.api.doLogin()
      .then((data: any) => {
        this.api.user = data.user;
        this.api.storage.set('user', data.user).then(() => {
          loading.dismiss();
          this.goTo()
          console.log(data);
        });
      })

      .catch((err) => {
        console.error(err);
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: 'Usuario y Contraseña Invalidos',
          buttons: ['OK']
        });
        loading.dismiss();
        alert.present();

      });
  }

  loginWithFacebook() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo-completo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.facebook.login(['public_profile', 'email'])
      .then((data) => {
        console.log(data);
        this.facebook.api(`${data.authResponse.userID}/?fields=id,email,name,picture,first_name,last_name,gender`, ['public_profile', 'email']).then((data) => {
          console.log(data);
          this.api.loginOAuth(data).then((data) => {
            console.log(data);
            this.api.saveData(data);
            this.goTo();
            loading.dismiss();
          }).catch((err) => {
            console.error(err);
            loading.dismiss();
            this.alertCtrl.create({
              message: JSON.stringify(err),
              title: "Error",
            }).present();

          });
        }).catch((err) => {
          console.error(err);
          loading.dismiss();
          this.alertCtrl.create({
            message: err,
            title: "Error",
          }).present();

        })
      }).catch((err) => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl.create({
          message: err,
          title: "Error",
        }).present();

      });
  }

  loginWithGoogle() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo-completo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.google.login({})
      .then((data) => {
        console.log(data);
        loading.dismiss();
      })
      .catch((err) => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl.create({
          message: err,
          title: "Error",
        }).present();
      });
  }

  recover(email) {
    this.api.post('forgot-password', { email: email })
      .then(() => {
        let alert = this.alertCtrl.create({
          title: "Listo!",
          subTitle: 'Le hemos enviado un correo de recuperación',
          buttons: ['OK']
        });
        alert.present();
      })
      .catch(() => {
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: 'No hemos podido validar el usuario asegurese de escribirlo correctamente',
          buttons: ['OK']
        });
        alert.present();
      });
  }

  getServers() {
    this.api.http.get('http://residenciasonline.com/residencias/public/servers.json')
      .map(res => res.json())
      .subscribe(data => {
        this.servers = data
        this.ready = true
        console.log(this.servers);
      }, (err) => { console.error(err) });
  }
  goTo() {
    this.events.publish('login', {});
    this.navCtrl.setRoot(HomePage);
  }

}
