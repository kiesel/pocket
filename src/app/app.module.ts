import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { RestService } from './rest.service';
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    RestService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
