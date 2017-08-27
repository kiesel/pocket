import { Injectable } from '@angular/core';

import { RestService } from './rest.service';

@Injectable()
export class AuthService {
  private requestToken: string = null;
  private accessToken: string = null;
  private redirectUri: string = null;
  private username: string = null;

  constructor(
    private restService: RestService,
  ) {
    if (this.getAccessToken()) {
      this.restService.setAccessToken(this.getAccessToken());
    } else {
      this.consumeAuthentication();
    }
  }

  public isAuthenticated(): boolean {
    return (this.getAccessToken() != null);
  }

  public initiateAuthentication() {
    this.obtainRequestToken();
  }

  public obtainRequestToken(redirectUri?: string): void {
    if (!redirectUri) {
      redirectUri = window.location.href;
    }

    // Remember for later reuse
    this.redirectUri = encodeURI(redirectUri);

    // Only try to obtain token if none is available, yet:
    if (this.getRequestToken()) {
      console.log('Not doing anything now...');
      return;
      // return this.redirectToPocket();
    }

    this.restService.oauthRequest(redirectUri)
      .subscribe(res => {
        console.log('Received requestToken %o', res);

        this.storeRequestToken(res.code);
        this.redirectToPocket();
      }
    );
  }

  public consumeAuthentication() {
    if (!this.getRequestToken() && this.getAccessToken()) {
      return ;
    }

    this.restService.oauthAuthorize(this.requestToken)
      .subscribe(res => {
        console.log('Received accessToken %o', res);

        this.username = res.username;
        this.storeAccessToken(res.access_token);
        this.clearRequestToken();
      })
    ;
  }


  private storeRequestToken(token: string) {
    this.requestToken = token;
    this.persist();
  }

  private getRequestToken(): string {
    this.materialize();
    return this.requestToken;
  }

  private clearRequestToken() {
    this.requestToken = null;
    this.persist();
  }

  private storeAccessToken(token: string) {
    this.accessToken = token;
    this.persist();
  }

  private getAccessToken(): string {
    this.materialize();
    return this.accessToken;
  }

  private persist() {
    sessionStorage.setItem('pocket_auth', JSON.stringify({
      'request_token': this.requestToken,
      'access_token': this.accessToken,
      'username': this.username,
    }));
  }

  private materialize() {
    let data = JSON.parse(sessionStorage.getItem('pocket_auth'));
    if (data) {
      this.accessToken = data.access_token;
      this.requestToken = data.request_token;
      this.username = data.username;
    }
  }

  private redirectToPocket() {
    
    // Redirecting user out ...
    window.location.href = `https://getpocket.com/auth/authorize?request_token=${this.requestToken}&redirect_uri=${this.redirectUri}`;
  }
}
