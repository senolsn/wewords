import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../services/app.config";

export class LanguageInterceptor implements HttpInterceptor {

  constructor(private readonly appConfig: AppConfig) {
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = localStorage.getItem(this.appConfig.langKey);

    if (lang !== undefined && lang !== null) {
      req = req.clone({
        setHeaders: { language: String(lang) }
      })
    }

    return next.handle(req);
  }
}