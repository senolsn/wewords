import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.tokenService.userIsLoggedIn())
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${this.tokenService.getToken()}` }
      });

    return next.handle(req);
  }
}