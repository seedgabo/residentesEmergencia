import { Api } from './../../providers/api';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, Events, MenuController, Content, ModalController } from 'ionic-angular';
import { AddChatPage } from '../add-chat/add-chat';
import $ from 'jquery';
var func;
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  message = "";
  chat = null;
  loading = false;
  sending = false;
  messages = [];
  residences = [];
  constructor(public menuCtrl: MenuController, public ngzone: NgZone, public navCtrl: NavController, public navParams: NavParams, public events: Events, public modal: ModalController, public api: Api) {
  }

  ionViewDidLoad() {
    this.getData();
    func = (data) => {
      this.newMessage
    }
    this.events.subscribe("Chat", func);
    this.api.get("residences")
      .then((data: any) => {
        this.residences = data;
      })
      .catch(console.error)

    setTimeout(() => {
      this.menuCtrl.open('chatMenu')

    }, 550)

  }
  ionViewWillUnload() {
    this.events.unsubscribe("Chat", func);
  }

  newMessage(data) {
    if (this.chat && data.thread.id == this.chat.id && data.sender.id != this.api.user.id) {
      var msg = {
        user: data.sender,
        body: data.message.body,
      };
      msg.user.residence = data.residence;
      this.messages.push(msg);
    }
    else if (this.isIn(data.thread.id, this.api.chats, "id")) {
      var length = this.api.chats.length;
      for (var i = 0; i < length; i++) {
        if (this.api.chats[i].id === data.thread.id)
          if (this.api.chats[i].unread)
            this.api.chats[i].unread = 1
          else
            this.api.chats[i].unread++;
      }
    }
    else {
      this.api.chats.push(data.thread);
      this.selectChat(data.thread);
      data.thread.unread = 1;
    }
  }

  isIn(search, array, key) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
      if (search === array[i][key])
        return true
    }
    return false;
  }

  getData() {
    this.api.get('messages')
      .then((data: any) => {
        this.api.chats = data;
      })
      .catch((err) => {
        console.error(err)
      });
  }

  send() {
    if (this.message.length === 0 || !this.chat) {
      return;
    }
    this.sending = true;
    this.api.put("messages/" + this.chat.id + "?message=" + this.message, {})
      .then((data) => {
        this.messages[this.messages.length] = {
          body: this.message,
          created_at: new Date(),
          user: {
            name: this.api.user.name,
            image_url: this.api.user.image_url,
            residence: {
              name: this.api.residence.name
            }
          }
        };
        this.message = "";
        this.sending = false;
        this.scrolltoBottom();
      })
      .catch(console.error)
  }

  addChat(residence) {
    var modal = this.modal.create(AddChatPage, { residences: this.residences });
    modal.onWillDismiss((thread) => {
      this.getData();
      this.selectChat(thread);
      this.getData();
    });
    modal.present();
  }

  createChat(residence) {
    this.api.post('messages/' + residence.id, {})
      .then((data: any) => {
        console.log(data)
        this.selectChat(data.thread);
        this.getData();
      })
      .catch(console.error)
  }

  selectChat(chat) {
    this.chat = chat
    this.chat.unread = 0
    this.getMessages(chat.id)
    this.scrolltoBottom()
  }

  getMessages(threadId) {
    this.loading = true
    this.messages = []
    this.api.get(`messages/${threadId}`)
      .then((data: any) => {
        console.log('data', data)
        this.messages = data.messages.reverse()
        this.loading = false
        this.scrolltoBottom()

      })
      .catch(console.error)

  }

  scrolltoBottom() {
    setTimeout(() => {
      this.ngzone.run(() => {
        $("#chat .scroll-content").animate({ scrollTop: $("#chat .scroll-content").height() + 10000 }, 1000);
      })
    }, 50)
  }

}
