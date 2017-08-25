import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {
  private static API_URL = '/v3/';
  private requestOptions = new RequestOptions({
    headers: new Headers({
      'X-Accept': 'application/json',
    })
  });

  private consumerKey = '70107-9dfd51410afc19a32cecf7d0';

  constructor(
    private http: Http,
  ) {
  }

  public oauthRequest(redirectUri: string): Observable<any> {
    return this.http.post(RestService.API_URL + 'oauth/request', {
      consumer_key: this.consumerKey,
      redirect_uri: redirectUri,
    }, this.requestOptions).map(res => res.json());
  }

  public oauthAuthorize(requestToken: string): Observable<any> {
    return this.http.post(RestService.API_URL + 'oauth/authorize', {
      consumer_key: this.consumerKey,
      code: requestToken
    }, this.requestOptions).map(res => res.json());
  }
}
