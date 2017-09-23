import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Deeplinks } from "@ionic-native/deeplinks";

import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Api } from "../providers/api";
import { AppMinimize } from "@ionic-native/app-minimize";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  see_residences = false
  pages: Array<any>;
  disabled_panic = false;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public minimize: AppMinimize, public deeplinks: Deeplinks, public events: Events) {
    this.platform.ready().then(() => {
      this.api.ready.then(() => {
        this.initializeApp();
        console.log(this.api.user);
        if (this.api.user) {
          this.rootPage = HomePage;
          this.api.getAllData();
          this.api.getLang();
          this.registerDeepLinks();
        } else {
          this.rootPage = Login;
        }

      });
      events.subscribe('login', () => {
        this.registerDeepLinks();
      })
      events.subscribe('logout', () => {
        this.logout();
      })
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack())
          return this.nav.pop();
        this.minimize.minimize();
        console.log("minimize");
      });

      this.backgroundmode.enable();
      this.backgroundmode.setDefaults(
        { icon: 'icon', text: "", title: "Residentes Online", color: "#42f459", bigText: true, silent: true }
      );
      this.backgroundmode.excludeFromTaskList();
      // this.backgroundmode.overrideBackButton();
      this.codepush.sync({ updateDialog: false, ignoreFailedUpdates: false, }).subscribe((syncStatus) => console.log(syncStatus), (err) => { console.warn(err) });
    });
  }

  changeResidence(residence) {
    this.api.user.residence_id = residence.id;
    this.api.storage.set("user", this.api.user);
    this.api.put('users/' + this.api.user.id, { residence_id: residence.id })
      .then((data) => {
        console.log("change residence:", data);
        window.location.reload();
      })
      .catch(console.error)
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  registerDeepLinks() {
  }

  logout() {
    this.api.stopEcho();
    this.api.username = ""
    this.api.url = ""
    this.api.user = null;
    this.api.password = ""
    this.api.residence = null;
    this.api.onesignal.setSubscription(false);
    this.api.clearSharedPreferences();
    this.api.storage.clear().then(() => {
      this.nav.setRoot(Login);
    });
  }

  panic() {
    this.disabled_panic = true;
    this.api.panic()
      .then(() => {
        this.disabled_panic = false;
      })
      .catch(() => {
        this.disabled_panic = false;
      });

  }

  siteHas(modul) {
    if (!this.api.modules) {
      return false;
    }
    else if (modul === undefined || this.api.modules[modul] === undefined) {
      return true
    }
    return this.api.modules[modul];
  }
}
