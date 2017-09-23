import { Component, Input } from '@angular/core';
@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent {
  @Input() news: any;

  constructor() {
  }

}
