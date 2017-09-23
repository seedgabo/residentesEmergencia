import { ReservationsPage } from './../pages/reservations/reservations';
import { TablesPage } from './../pages/tables/tables';
import { SurveyPage } from './../pages/survey/survey';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Deeplinks } from "@ionic-native/deeplinks";

import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { Login } from '../pages/login/login';
import { Residences } from "../pages/residences/residences";
import { Api } from "../providers/api";
import { AppMinimize } from "@ionic-native/app-minimize";
import { VisitTabsPage } from "../pages/visit-tabs/visit-tabs";
import { EventsPage } from "../pages/events/events";
import { InvoicesPage } from "../pages/invoices/invoices";
import { DocumentsPage } from "../pages/documents/documents";
import { PostsPage } from "../pages/posts/posts";
import { SurveysPage } from "../pages/surveys/surveys";
import { ProfilePage } from "../pages/profile/profile";
import { ChatsPage } from '../pages/chats/chats';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  see_residences = false
  pages: Array<any>;
  VisitTabsPage = VisitTabsPage;
  disabled_panic = false;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public minimize: AppMinimize, public deeplinks: Deeplinks, public events: Events) {
    this.platform.ready().then(() => {
      this.api.ready.then(() => {
        this.initializeApp();
        console.log(this.api.user);
        if (this.api.user) {
          this.rootPage = HomePage;
          // this.rootPage = ReservationsPage;
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

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "home", component: HomePage, icon: 'home' },
      { title: "profile", component: ProfilePage, icon: 'person' },
      { title: "posts", component: PostsPage, icon: 'paper' },
      { title: "visitors", component: VisitTabsPage, icon: 'contacts' },
      { title: "lists", component: TablesPage, icon: 'list' },
      { title: "surveys", component: SurveysPage, icon: 'pie' },
      { title: "events", component: EventsPage, icon: 'calendar' },
      { title: "invoices", component: InvoicesPage, icon: 'card', modules: 'finanze' },
      { title: "dynamic_documents", component: DocumentsPage, icon: 'document' },
      { title: "reservations", component: ReservationsPage, icon: 'tennisball', modules: 'reservations', beta: true },
      { title: "parkings", component: ParkingsPage, icon: 'car', modules: 'parkings' },
      { title: "residences", component: Residences, icon: 'albums' },
      { title: "chats", component: ChatsPage, icon: 'chatbubbles', modules: 'chat' },
    ];

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
        { icon: 'icon', text: "", title: "Residentes Online", color: "#42f459", bigText: true }
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
    this.deeplinks.route({
      '/visit/:visitId': VisitTabsPage,
      '/visitor/:visitorId': VisitTabsPage,
      '/surveys': SurveyPage,
    }).subscribe((match) => {
      console.log('Successfully routed', match);
      var args = {};
      for (var key in match.$args) {
        args[key] = match.$args[key];
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visit") > -1) {
        this.nav.setRoot(VisitTabsPage, args);
        setTimeout(() => {
          this.api.newVisit(args);
        }, 2000)
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visitor") > -1) {
        this.nav.setRoot(VisitTabsPage, args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/surveys") > -1) {
        this.nav.setRoot(SurveyPage, args);
      }
    }, (nomatch) => {
      this.nav.setRoot(HomePage);
      console.warn('Unmatched Route', nomatch);
    });
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
