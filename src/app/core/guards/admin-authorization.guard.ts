import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { TokenService } from "../services/token.service";

@Injectable({
  providedIn: 'root'
})

export class AdminAuthorizationGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate() {
    if (this.tokenService.isAdmin() && !this.tokenService.isExpired()) {
      return true;
    }

    this.router.navigate(['auth/login']);
    return false;
  }
}