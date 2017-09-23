import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  @ViewChild('searchbar') searchbar;
  post = { title: "", text: "", tags: [], user_id: this.api.user.id };
  provider;
  tags = [];
  selected_tags = [];
  post_image = null
  uploading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.get('tags').then((tags: any) => {
      console.log(tags);
      this.tags = tags;
    })
      .catch((err) => {
        console.error(err);
      });
    this.provider = {
      labelAttribute: "name",
      getResults: (q) => {
        return this.tags.filter(tag => {
          if (this.selected_tags.indexOf(tag) > -1)
            return false;
          return tag.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
        });
      }
    }
  }


  createPost() {
    this.uploading = true
    this.selected_tags.forEach((tag) => {
      this.post.tags.push(tag.name);
    });
    this.api.post('posts', this.post)
      .then((data: any) => {
        if (this.post_image) {
          this.uploadImage(data.id)
            .then((resp) => {
              this.uploading = false;
              console.log(data);
              this.close();
            })
            .catch((err) => {
              console.error(err);
            })
        }
        else {
          this.uploading = false;
          console.log(data);
          this.close();
        }
      })
      .catch((err) => {
        console.error(err);
      })
  }
  uploadImage(id) {
    return this.api.post('images/upload/post/' + id, { image: this.post_image })
  }

  addTag(ev) {
    this.selected_tags.push(ev);
    this.searchbar.keyword = "";
  }
  deleteTag(tag, index) {
    this.selected_tags.splice(index, 1);
  }
  close() {
    this.navCtrl.pop();
  }
  askFile() {
    var filer: any = document.querySelector("#input-file")
    filer.click();
  }
  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.post_image = result.target.result;
      };
    } catch (error) {
      console.error(error)
    }
  }



}
