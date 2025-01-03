import { Injectable } from "@angular/core";
import { AppConfig } from "./app.config";
import * as formNames from '../../../assets/config/app.forms.json'

@Injectable({
  providedIn: 'root'
})

export class UrlService {
  private readonly baseUrl: string;
  private readonly authUrl: string;

  constructor(appConfig: AppConfig) {
    this.baseUrl = appConfig.baseUrl;
    this.authUrl = appConfig.authUrl;
  }

  public getUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  public getAuthUrl(url: string): string {
    return `${this.authUrl}${url}`;
  }

  public getFormNames() {
    return formNames;
  }
}