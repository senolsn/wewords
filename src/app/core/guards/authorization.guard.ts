import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable(
  { providedIn: 'root' }
)

export class AuthorizationGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate() {
    if (this.tokenService.getToken() && !this.tokenService.isExpired()) {
      return true;
    }

    this.router.navigate(['auth/login']);
    return false;
  }

}