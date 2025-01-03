import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfig } from "./app.config";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private jwtHelper = new JwtHelperService();
  private tokenName: string;

  constructor(private appConfig: AppConfig) {
    this.tokenName = this.appConfig.tokenName;
  }

  decodeToken = () => {
    return this.jwtHelper.decodeToken(this.getToken())
  };

  getToken = () => {
    return localStorage.getItem(this.tokenName) ?? ""
  };

  setToken = (token: string) => {
    localStorage.setItem(this.tokenName, token)
  };

  removeToken = () => localStorage.removeItem(this.tokenName);

  getUserId = () => {
    return this.decodeToken().userid
  };

  getCurrentUserName = (): string => {
    return this.decodeToken().username
  };

  isAdmin = () => {
    return this.decodeToken().admin === true
  };

  userIsLoggedIn = (): boolean => {
    const token = this.getToken();
    return token !== null && token !== undefined && !this.isExpired();
  }

  isExpired = (): boolean => {
    return this.jwtHelper.isTokenExpired(this.getToken())
  };

}