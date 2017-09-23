import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { AddPostPage } from "../add-post/add-post";

@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {
  posts: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidEnter() {
    this.getPosts();
  }

  getPosts(refresher = null) {
    this.api.get('posts?limit=50&order[created_at]=desc&with[]=user.residence&with[]=tags&with[]=image')
      .then((data: any) => {
        console.log(data);
        this.posts = data;
        if (refresher)
          refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        if (refresher)
          refresher.complete();
      });
  }

  createPost() {
    this.navCtrl.push(AddPostPage);
  }

  deletePost(post, index) {
    this.api.delete('posts/' + post.id)
      .then((dat) => {
        console.log(dat);
        this.posts.splice(index, index);
      })
      .catch((err) => {
        console.error(err);
      });
  }

}
