import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import appConfig from '../../../assets/config/app.config.json';
import appConfigProd from '../../../assets/config/app.config.prod.json';

@Injectable({
  providedIn: 'root'
})

export class AppConfig {
  public config: any = appConfig;

  constructor() {
    if (environment.production == true) {
      this.config = appConfigProd;
    }
  }

  public get baseUrl() {
    return this.config.apiUrl;
  }

  public get authUrl() {
    return this.config.authUrl;
  }

  public get tokenName() {
    return this.config.keys.tokenKey;
  }

  public get langKey() {
    return this.config.keys.langKey;
  }
}


