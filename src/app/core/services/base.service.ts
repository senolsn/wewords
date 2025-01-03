import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { UrlService } from "./url.service";
import { CustomStoreService } from "./custom-store.service";
import { map, Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import CustomStore from "devextreme/data/custom_store";
import { LoadOptions } from "devextreme/data";
import { CreateOrUpdate } from "../models/enums/CreateOrUpdate";

@Injectable({ providedIn: "root" })

export abstract class BaseService<T> {
    _controller: string;

    constructor(protected httpService: HttpService,
        protected urlService: UrlService,
        protected customStoreService: CustomStoreService,
        controller: string) {
        this._controller = controller;
    }

    public get(): Observable<Array<T>> | Observable<any> {
        const url = this.urlService.getUrl(this._controller);

        return this.httpService.get(url)
            .pipe(
                map(
                    (response: HttpResponse<any>) => {
                        return response.body;
                    }
                )
            );
    }

    public getCustomStoreData() {
        const url = this.urlService.getUrl(this._controller);

        return new CustomStore({
            key: 'refKey',
            load: (loadOptions: LoadOptions<any> | any) => {

                let httParams = this.customStoreService.setHttpParams(loadOptions);

                return this.httpService.get(url, { params: httParams })
                    .toPromise()
                    .then(response => {
                        return {
                            data: response.body.data,
                            totalCount: response.body.totalCount,
                            summary: response.body.summary,
                            groupCount: response.body.groupCount
                        };
                    })
                    .catch(() => { throw 'Veriler yüklenirken bir hata oluştu' });
            }
        });
    }

    public save(data: T, createOrUpdate?: CreateOrUpdate, callback?: (message: string) => void): Observable<HttpResponse<any>> {
        if (createOrUpdate === CreateOrUpdate.create) {
            const url = this.urlService.getUrl(`${this._controller}/Create`);

            return this.httpService.post<T>(url, data)
                .pipe(
                    map((response: HttpResponse<any>) => {
                        if (response)
                            callback?.("GLOBAL.SUCCESS");

                        return response;
                    })
                )
        }
        else {
            const url = this.urlService.getUrl(`${this._controller}/Update`);

            return this.httpService.put<T>(url, data)
                .pipe(
                    map((response: HttpResponse<any>) => {
                        if (response)
                            callback?.("GLOBAL.SUCCESS");

                        return response;
                    })
                )
        }
    }

    public remove(id: string, callback?: (message: string) => void): Observable<HttpResponse<any>> {
        
        const url = this.urlService.getUrl(`${this._controller}/Delete`);

        return this.httpService.delete(url, id)
            .pipe(
                map((response: HttpResponse<any>) => {
                    if (response)
                        callback?.("GLOBAL.SUCCESS");

                    return response;
                })
            )
    }
}