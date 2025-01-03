import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from './app.config';
import { EMPTY, Observable, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public languages: string[] = ['en', 'tr'];

  constructor(public translateService: TranslateService,
    private appConfig: AppConfig) {

    let browserLang: any;
    browserLang = translateService.getBrowserLang();

    translateService.use('tr');
    //translateService.use(browserLang.match(/en|tr/) ? browserLang : 'tr');
  }

  setLanguage = (language: any) => {
    localStorage.setItem(this.appConfig.langKey, language);

    this.useTranslate();
  }

  getLanguage = (): string => {
    return localStorage.getItem(this.appConfig.langKey) ?? "tr"
  }

  useTranslate = (): Observable<any> | Observable<never> => {
    let language = this.getLanguage();

    if (language !== null) {
      return this.translateService.use(language)
    }

    return EMPTY;
  }

  // translate = async (message: string): Promise<string> => {
  //   return await firstValueFrom(this.translateService.get(message));
  // }
  translate = (message: string) => {
    return this.translateService.get(message);
  }

  instantTranslate = (message: string): string => {
    return this.translateService.instant(message)
  }
}
