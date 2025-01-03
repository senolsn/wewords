import { HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { KullaniciTanim } from 'src/app/core/models/kullanici-tanim';
import { BaseService } from 'src/app/core/services/base.service';
import { CustomStoreService } from 'src/app/core/services/custom-store.service';
import { HttpService } from 'src/app/core/services/http.service';
import { UrlService } from 'src/app/core/services/url.service';

@Injectable({
  providedIn: 'root'
})
export class KullaniciTanimService extends BaseService<KullaniciTanim> {

  constructor(@Inject(HttpService) httpService: HttpService, @Inject(UrlService) urlService: UrlService, @Inject(CustomStoreService) customStoreService: CustomStoreService) {
    super(httpService, urlService, customStoreService, "Users");
  }

  public getAllKullaniciTanim(): Observable<any> {
    const url = this.urlService.getUrl("Users/GetListAsync");

    return this.httpService.get(url).pipe(
      map((response: HttpResponse<any>) => {
        return response.body.data;
      })
    );
  }
}
