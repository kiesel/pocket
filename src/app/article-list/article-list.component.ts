import { Component, OnInit } from '@angular/core';

import { RestService } from '../rest.service';
import { Article } from '../rest-service/article';
import { ArticleList } from '../rest-service/article-list';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  private articles: any;

  constructor(
    private restService: RestService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.restService.getUnreadArticles().subscribe(res => {
        console.log('Received %o', res);
        this.articles = res;
      });
    }, 1000);
  }

  public unreadArticles() {
    if (!this.articles) {
      return null;
    }

    return Object.values(this.articles.list);
  }

}
