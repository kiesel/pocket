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
    this.consumeAuthentication();
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
      console.log('requestToken= %o accessToken= %o', this.getRequestToken(), this.getAccessToken());
      return ;
    }

    this.restService.oauthAuthorize(this.requestToken)
      .subscribe(res => {
        console.log('Received accessToken %o', res);

        this.storeAccessToken(res.access_token);
        this.clearRequestToken();
        this.username = res.username;
      })
    ;
  }


  private storeRequestToken(token: string) {
    this.requestToken = token;
    sessionStorage.setItem('pocket_requestToken', this.requestToken);
  }

  private getRequestToken(): string {
    if (!this.requestToken) {
      this.requestToken = sessionStorage.getItem('pocket_requestToken');
    }

    return this.requestToken;
  }

  private clearRequestToken() {
    this.requestToken = null;
    sessionStorage.removeItem('pocket_requestToken');
  }

  private storeAccessToken(token: string) {
    this.accessToken = token;
    sessionStorage.setItem('pocket_accessToken', this.accessToken);
  }

  private getAccessToken(): string {
    if (!this.accessToken) {
      this.accessToken = sessionStorage.getItem('pocket_accesstoken');
    }

    return this.accessToken;
  }

  private redirectToPocket() {
    
    // Redirecting user out ...
    window.location.href = `https://getpocket.com/auth/authorize?request_token=${this.requestToken}&redirect_uri=${this.redirectUri}`;
  }
}
