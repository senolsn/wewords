
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { User } from '../models/user.model';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { UrlService } from './url.service';

@Injectable({ providedIn: 'root' })

export class AuthService {

    private userSubject: BehaviorSubject<User>;

    constructor(private httpService: HttpService,
        private urlService: UrlService,
        private tokenService: TokenService,
        private router: Router) {

        this.userSubject = new BehaviorSubject<User>(new User());
    }

    public login(user: User): Observable<any> {
        
        const url = this.urlService.getAuthUrl("Auths/Login")

        //1- RxJS operatörlerini alır ve onları bir zincirleme ve birleştirme işlemi yapar. Bu, verilerinizi işlemek için bir dizi operatörü ardışık olarak uygulamanızı sağlar.
        return this.httpService.post(url, user).pipe(
            //2-SwitchMap : Dış Observable'ı alır (response) iç observable'ı döndürür (of(decodedToken));
            //3-Not: SwitchMap Observable döndürmek zorundadır.
            //4-switchMap: İç içe Observable'ları düzleştirir ve yalnızca en son gelen Observable'ı döner. Önceki Observable'lar iptal edilir.
            switchMap((response: HttpResponse<any>) => {

                this.tokenService.setToken(response.body.data.token);

                const decodedToken = this.tokenService.decodeToken();
                return of(decodedToken);
            })
        );
    }

    public logout() {
        this.tokenService.removeToken()
        this.router.navigate(['/auth/login']);
    }


    public getUser(): Observable<User> {
        return this.userSubject.asObservable();
    }
}

