import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @Input() public article;
  constructor() { }

  ngOnInit() {
  }

  get date_added(): string {
    return new Date(this.article.time_added * 1000).toISOString();
  }

  public getAuthor(): string {
    for (let author of Object.values(this.article.authors)) {
      return author.name;
    }

    return null;
  }

  public diagnostics() {
    console.log(this);
  }
}
