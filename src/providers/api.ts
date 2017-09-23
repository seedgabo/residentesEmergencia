import { Injectable, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { PopoverController, ToastController, Events, Platform } from "ionic-angular";
import { Storage } from '@ionic/storage';

import { NewVisitPage } from "../pages/new-visit/new-visit";


import { BackgroundMode } from "@ionic-native/background-mode";
import { OneSignal } from "@ionic-native/onesignal";
import { Device } from "@ionic-native/device";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import moment from 'moment';
import { Vibration } from '@ionic-native/vibration';
declare var window: any;
moment.locale('es');
window.Pusher = Pusher;

@Injectable()
export class Api {
  sound: HTMLAudioElement;
  modules: any;
  settings: any;
  Echo: any = undefined;
  url = null;
  // url = "http://localhost/residencias/public/";
  username = "";
  password = "";
  user;
  residence;
  resolve;
  ready: Promise<any> = new Promise((resolve) => {
    this.resolve = resolve;
  });
  langs = {};
  workers = [];
  vehicles = [];
  visitors = [];
  residences = [];
  users = [];
  parkings = [];
  visits = [];
  invoices = [];
  pets = [];
  chats = [];
  _events = [];
  constructor(public http: Http, public storage: Storage, public zone: NgZone, public popover: PopoverController, public toast: ToastController, public events: Events, public background: BackgroundMode, public onesignal: OneSignal, public device: Device, public platform: Platform, public vibration: Vibration) {
    storage.ready().then(() => {
      storage.get('username').then(username => { this.username = username });
      storage.get('password').then(password => { this.password = password });
      storage.get('modules').then(modules => { this.modules = modules });
      storage.get('settings').then(settings => { this.settings = settings });
      storage.get('langs').then(langs => { this.langs = langs; console.log(langs) });
      storage.get('residence').then(residence => { this.residence = residence; });
      storage.get('url').then(url => {
        this.url = url
        storage.get('user').then(user => {
          this.user = user
          this.resolve(user);
        });
      });
      storage.get('allData').then((data) => {
        if (!data) return;
        this.residence = data.residence;
        this.visitors = data.visitors;
        this.visits = data.visits;
        this.vehicles = data.vehicles;
        this.workers = data.workers;
        this.users = data.users;
        this.residences = data.residences;
      });
      this.events.subscribe('stopSound', () => {
        if (this.sound)
          this.sound.pause();
      });
      window.$api = this;

    });
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/login", { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          this.user = data.user;
          this.residence = data.residence;
          this.settings = data.settings;
          this.modules = data.modules;

          this.visitors = this.residence.visitors;
          this.visits = this.residence.visits;
          this.vehicles = this.residence.vehicles;
          this.workers = this.residence.workers;
          this.pets = this.residence.pets;
          this.users = this.residence.users;
          this.parkings = this.residence.parkings;
          this.invoices = this.residence.invoices;

          this.storage.set('user', data.user);
          this.storage.set('residence', data.residence);
          this.storage.set('username', this.username);
          this.storage.set('password', this.password);
          this.storage.set('modules', this.modules);
          this.storage.set('settings', this.settings);
          this.getLang();

          this.saveSharedPreferences();
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  getLang() {
    this.get('lang')
      .then((langs) => {
        console.log(langs);
        this.storage.set('langs', langs);
        this.langs = langs;
      })
      .catch((err) => {
        console.error('error trying to download translations', err);
      })
  }

  getAllData() {
    var promise = this.get('getData');
    promise.then((data: any) => {
      console.log(data);
      this.residence = data.residence;
      this.user.residence_id = data.residence.id;
      this.visitors = data.visitors;
      this.visits = data.visits;
      this.vehicles = data.vehicles;
      this.workers = data.workers;
      this.pets = data.pets;
      this.users = data.users;
      this.user.residences = data.residences;
      this.parkings = data.parkings;
      this.invoices = data.invoices;
      this.residences = data.residences;
      this.storage.set('allData', data);
      this.saveSharedPreferences();
    }).catch((err) => {
      console.error(err);
    });
    this.pushRegister(this.user.onesignal_appId);
    return promise;
  }

  get(uri) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  post(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  put(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  delete(uri) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  saveData(userData) {
    this.user = userData.user;
    this.user.residences = userData.residences;
    this.settings = userData.settings;
    this.modules = userData.modules;
    this.storage.set('user', this.user);
    this.storage.set('modules', this.modules);
    this.storage.set('settings', this.settings);
    this.getLang();
  }

  loginOAuth(userData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/login/oauth", userData, {})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  startEcho() {
    this.ready.then(() => {
      if (this.Echo) {
        console.warn('already started Echo');
        this.stopEcho()
      }
      console.log("echo to:", this.user.hostEcho);
      this.Echo = new Echo({
        key: '807bbfb3ca20f7bb886e',
        authEndpoint: this.url + 'broadcasting/auth',
        broadcaster: 'socket.io', // pusher o socket.io
        host: this.user.hostEcho,
        // host: "http://localhost:6001",
        // encrypted: false,
        // cluster: 'eu',
        auth:
        {
          headers:
          {
            'Auth-Token': this.user.token,
            'Authorization': "Basic " + btoa(this.username + ":" + this.password)
          }
        }

      });
      this.Echo.private('Application')

        .listen('ParkingCreated', (data) => {
          console.log("created parking:", data);
          this.zone.run(() => {
            data.parking.user = data.user;
            data.parking.residence = data.residence;
            this.parkings[this.parkings.length] = data.parking;
          })
        })
        .listen('ParkingUpdated', (data) => {
          console.log("updated parking:", data);
          var parking = this.parkings.findIndex((parking) => {
            return parking.id === data.parking.id;
          });
          this.zone.run(() => {
            data.parking.user = data.user;
            data.parking.residence = data.residence;
            if (parking >= 0) {
              this.parkings[parking] = data.parking;

            }
            else {
              this.parkings[this.parkings.length] = data.parking;
            }
          });
        })
        .listen('ParkingDeleted', (data) => {
          console.log("deleted parking:", data);
          var parking = this.parkings.findIndex((parking) => {
            return parking.id === data.parking.id;
          });
          this.zone.run(() => {
            if (parking >= 0) {
              this.parkings.splice(parking, 1);
            }
          })
        })

        .listen('VisitorCreated', (data) => {
          console.log("created visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;
          this.zone.run(() => {
            var visitor = this.visitors[this.visitors.length] = data.visitor;
            if (data.image)
              visitor.image = data.image;
          })
        })
        .listen('VisitorUpdated', (data) => {
          console.log("updated visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;
          var visitor_index = this.visitors.findIndex((visitor) => {
            return visitor.id === data.visitor.id;
          });
          this.zone.run(() => {
            if (visitor_index > -1)
              var visitor = this.visitors[visitor_index] = data.visitor;
            else {
              var visitor = this.visitors[this.visitors.length] = data.visitor;
            }
            if (data.image) {
              visitor.image = data.image;
            }
          });
        })
        .listen('VisitorDeleted', (data) => {
          console.log("deleted visitor:", data);
          var visitor = this.visitors.findIndex((visitor) => {
            return visitor.id === data.visitor.id;
          });
          this.zone.run(() => {
            if (visitor >= 0) {
              this.visitors.splice(visitor, 1);
            }
          })
        })


        .listen('VisitCreated', (data) => {
          if (data.visitor.residence_id != this.residence.id) return;
          console.log("created vist:", data);

          this.zone.run(() => {
            this.visits.unshift(data.visit);
            var visit = this.visits[0];
            visit.visitor = data.visitor;
            visit.visitors = data.visitors;
            this.visitStatus(visit);
          })
        })
        .listen('VisitUpdated', (data) => {
          console.log("updated visit:", data);
          if (data.visit.residence_id !== this.residence.id) return;
          data.visit.visitor = data.visitor;
          data.visit.visitors = data.visitors;
          this.events.publish('VisitUpdated', data);

          var visit_index = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            if (visit_index > -1) {
              var visit = this.visits[visit_index] = data.visit;
              if (this.visits[visit_index].status !== data.visit.status) {
                this.visitStatus(visit);
              }
            }
            else {
              this.visits.unshift(data.visit);
              var visit = this.visits[0];
              this.visitStatus(visit);
            }

          });
        })
        .listen('VisitDeleted', (data) => {
          console.log("deleted visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;

          var visit = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            if (visit >= 0) {
              this.visits.splice(visit, 1);
            }
          })
        })

        .listen('PetCreated', (data) => {
          console.log("created pet:", data);
          if (data.pet.residence_id != this.residence.id) return;
          this.zone.run(() => {
            var pet = this.pets[this.pets.length] = data.pet;
            if (data.image)
              pet.image = data.image;
          })
        })
        .listen('PetUpdated', (data) => {
          console.log("updated pet:", data);
          if (data.pet.residence_id != this.residence.id) return;
          var pet_index = this.pets.findIndex((pet) => {
            return pet.id === data.pet.id;
          });
          this.zone.run(() => {
            if (pet_index > -1)
              var pet = this.pets[pet_index] = data.pet;
            else {
              var pet = this.pets[this.pets.length] = data.pet;
            }
            if (data.image) {
              pet.image = data.image;
            }
          });
        })
        .listen('PetDeleted', (data) => {
          console.log("deleted pet:", data);
          var pet = this.pets.findIndex((pet) => {
            return pet.id === data.pet.id;
          });
          this.zone.run(() => {
            if (pet >= 0) {
              this.pets.splice(pet, 1);
            }
          })
        })

        .listen('WorkerCreated', (data) => {
          console.log("created worker:", data);
          if (data.worker.residence_id != this.residence.id) return;
          this.zone.run(() => {
            var worker = this.workers[this.workers.length] = data.worker;
            if (data.image)
              worker.image = data.image;
          })
        })
        .listen('WorkerUpdated', (data) => {
          console.log("updated worker:", data);
          if (data.worker.residence_id != this.residence.id) return;
          var worker_index = this.workers.findIndex((worker) => {
            return worker.id === data.worker.id;
          });
          this.zone.run(() => {
            if (worker_index > -1)
              var worker = this.workers[worker_index] = data.worker;
            else {
              var worker = this.workers[this.workers.length] = data.worker;
            }
            if (data.image) {
              worker.image = data.image;
            }
          });
        })
        .listen('WorkerDeleted', (data) => {
          console.log("deleted worker:", data);
          var worker = this.workers.findIndex((worker) => {
            return worker.id === data.worker.id;
          });
          this.zone.run(() => {
            if (worker >= 0) {
              this.workers.splice(worker, 1);
            }
          })
        })


        .listen('EventCreated', (data) => {
          if (!(data.event.privacity == "public" || data.event.creator.residece_id == this.user.residence_id)) return;
          console.log("created event:", data);
          this.zone.run(() => {
            this._events[this._events.length] = data.event
          })
          this.events.publish("events:changed", {});
        })
        .listen('EventUpdated', (data) => {
          console.log("updated event:", data);
          if (!(data.event.privacity == "public" || data.event.creator.residece_id == this.user.residence_id)) return;
          var event_index = this._events.findIndex((ev) => {
            return ev.id === data.event.id;
          });
          this.zone.run(() => {
            if (event_index > -1)
              this._events[event_index] = data.event;
          });
          this.events.publish("events:changed", {});

        })
        .listen('EventDeleted', (data) => {
          console.log("deleted event:", data);

          var event = this.visits.findIndex((visit) => {
            return event.id === data.event.id;
          });
          this.zone.run(() => {
            if (event >= 0) {
              this.visits.splice(event, 1);
            }
          })
          this.events.publish("events:changed", {});

        })

        .listen('SurveyCreated', (data) => {
          console.log("created survey:", data);
          this.events.publish('survey:created', data)
        })
        .listen('SurveyUpdated', (data) => {
          console.log("updated survey:", data);
          this.events.publish('survey:updated', data)

        })
        .listen('SurveyDeleted', (data) => {
          console.log("deleted survey:", data);
          this.events.publish('survey:deleted', data)

        })

      this.Echo.private('App.Residence.' + this.user.residence_id)
        .listen('VisitConfirm', (data) => {
          console.log("VisitConfirm: ", data);
          data.visit.visitor = data.visit.visitor;
          data.visit.visitors = data.visit.visitors;
          this.background.unlock();
          this.background.wakeUp();
          this.background.moveToForeground();
          this.newVisit(data.visit);
        })

      this.Echo.private('App.User.' + this.user.id)
        .listen('Chat', (data) => {
          console.log("new chat event", data);
          var thread = data.thread
          var message = data.message
          var sender = data.sender
          var residence = data.residence
          this.newChatMessage(thread, message, sender)
          this.events.publish('Chat', { thread: thread, message: message, sender: sender, residence: residence });
        })
        .notification((notification) => {
          console.log(notification);
        });

      this.Echo.join('App.Mobile')
        .here((data) => {
          console.log("here:", data);
        })
        .joining((data) => {
          console.log("joining", data);
        })
        .leaving((data) => {
          console.log("leaving", data);
        })



      // console.log(this.Echo);
    })
  }

  stopEcho() {
    this.Echo.leave('Application');
    this.Echo.leave('App.User.' + this.user.id);
    this.Echo.leave('App.Residence.' + this.user.residence_id);
    this.Echo.leave('App.Mobile');
    this.Echo = undefined;
  }

  pushRegister(appid = "ebf07feb-3c76-4639-8c87-b1e7a2e9ddd8") {
    this.onesignal.startInit(appid, "425679220353");
    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.Notification);
    this.onesignal.syncHashedEmail(this.user.email);
    this.onesignal.sendTag("user_id", this.user.id);
    this.onesignal.sendTag("residence_id", this.user.residence_id);
    this.onesignal.handleNotificationReceived().subscribe((not) => {
      console.log("push notification received", not);
    }, console.warn);

    this.onesignal.handleNotificationOpened().subscribe((not) => {
      console.log("push notification opened", not);
    }, console.warn);

    this.onesignal.endInit();
    this.onesignal.setSubscription(true);
    this.onesignal.getIds().then((ids: any) => {
      console.log("onesignal ids", ids)
      var data = {
        token: ids.userId,
        user_id: this.user.id,
        platform: this.device.platform,
        model: this.device.model,
        version: this.device.version,
      };
      this.post('register-push-device', data)
        .then((response) => {
          console.log('device registered:', response);
        })
        .catch(console.error);
    }).catch(console.error);
  }


  trans(value, args = null) {
    if (!this.langs) return value;
    var splits = value.split('.');
    if (splits.length == 2) {
      var base = this.langs[splits[0]];
      if (base) {
        var trans = base[splits[1]];
        if (trans) {
          value = trans;
        }
      }
    } else {
      var base = this.langs["__"];
      if (base) {
        var trans = base[value];
        if (trans) {
          value = trans;
        }
      }
    }
    if (args) {
      for (var k in args) {
        value = value.replace(':' + k, args[k]);
      }
    }
    return value.replace('literals.', '').replace('__.', '');
  }


  private setHeaders() {
    let headers = new Headers();
    if (this.user && this.user.token)
      headers.append("Auth-Token", this.user.token);
    else
      headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    return headers;
  }

  private handleData(res) {
    if (res.statusText == "Ok") {
      return { status: "No Parace haber conexión con el servidor" };
    }

    // If request fails, throw an Error that will be caught
    if (res.status < 200 || res.status >= 300) {
      return { error: res.status }
    }
    // If everything went fine, return the response
    else {
      return res;
    }
  }

  newVisit(visit) {
    this.playSoundNotfication();
    this.moveToFront();
    this.popover.create(NewVisitPage, { visit: visit, api: this }, { cssClass: "fullScreen", enableBackdropDismiss: false, showBackdrop: true }).present();
  }

  visitStatus(visit) {
    if (visit.status == 'waiting for confirmation') { return }
    this.toast.create({ message: this.trans("literals.visit") + " " + this.trans('literals.' + visit.status) + ": " + visit.visitor.name, duration: 12000, showCloseButton: true, closeButtonText: "X", position: "top", cssClass: visit.status }).present();
    this.playSoundBeep();
  }

  newChatMessage(thread, message, sender) {
    if (this.user.id !== sender.id) {
      var sender = sender;
      var msg = message.body;
      this.toast.create({
        message: `${thread.title} - ${sender.name}: ${msg}`,
        closeButtonText: "X",
        showCloseButton: true,
        duration: 2000,
        position: "top"
      }).present();
    }
    this.chats.forEach((chat) => {
      if (thread.id == chat.id) {
        if (!chat.unread) chat.unread = 1;
        chat.unread++;
      }
    });
    this.sound = new Audio('assets/sounds/chat.mp3');
    this.sound.play();
    return this.sound;
  }


  moveToFront() {
    this.background.unlock();
    this.background.wakeUp();
    this.background.moveToForeground();
  }

  playSoundNotfication() {
    this.sound = new Audio('assets/sounds/notifcations.mp3');
    this.sound.play();
    return this.sound;
  }

  playSoundBeep() {
    this.sound = new Audio('assets/sounds/beep.mp3');
    this.sound.play();
    return this.sound;
  }

  playSoundChat() {
    this.sound = new Audio('assets/sounds/chat.mp3');
    this.sound.play();
    return this.sound;
  }

  panic() {
    var data = {
      user: this.user,
      location: null,
    }
    var promise = this.post('panic', data)
    promise
      .then((data) => {
        console.log("panic sent:", data)
        this.toast.create({
          message: this.trans("__.panico enviado"),
          duration: 5000,
          position: 'top',
        }).present();
        this.vibration.vibrate(300)
        setTimeout(() => {
          this.vibration.vibrate(300)
        }, 600);
      })
      .catch((err) => {
        console.error(err)
        this.toast.create({
          message: this.trans("__.error enviado el panico"),
          duration: 5000,
          position: 'top',
        }).present();

      })
    return promise;
  }

  saveSharedPreferences() {
    try {
      if (!this.platform.is('android'))
        return;
      var prefs = window.SharedPreferences
      prefs.getSharedPreferences('residentes_online', 'MODE_PRIVATE', () => {
        prefs.putString('url', this.url)
        prefs.putString('token', this.user.token)
        prefs.putString('user_id', this.user.id)
        prefs.putString('residence_id', this.user.residence_id)
      }, console.error);

    }
    catch (e) {
      console.error("catch error saving shared pref", e)
    }
  }

  clearSharedPreferences() {
    try {
      if (!this.platform.is('android'))
        return;
      var prefs = window.SharedPreferences
      prefs.getSharedPreferences('residentes_online', 'MODE_PRIVATE', () => {
        prefs.remove('url')
        prefs.remove('token')
        prefs.remove('user_id')
        prefs.remove('residence_id')
      }, console.error);
    }
    catch (e) {
      console.error("catch error saving shared pref", e)
    }

  }

}
