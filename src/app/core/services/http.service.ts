import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from "rxjs";
import { HttpOptions } from "../models/http-options.model"
import { catchError, map } from "rxjs/operators";

@Injectable(
  { providedIn: "root" }
)

export class HttpService {
  private options: any = null;

  constructor(
    private readonly _httpClient: HttpClient) { }

  private configureOptions(options: {
    headers?: HttpHeaders | null,
    params?: HttpParams | null,
    responseType?: string
  } = {}) {
    const responseType = options.responseType || 'json';

    let headers = new HttpHeaders();

    if (options.headers instanceof HttpHeaders) {
      headers = options.headers;
    }
    else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    this.options = { params: options.params, headers: headers, responseType: responseType, observe: "response" }
  }

  public get(url: string, options?: Partial<HttpOptions>)
    : Observable<any> {
    this.configureOptions(options)

    return this._httpClient.get(url, this.options)
      .pipe(
        map((response) => response)
      );
  }

  public post<T>(url: string, model: T, options?: Partial<HttpOptions>)
    : Observable<any> {
    this.configureOptions(options);

    return this._httpClient.post(url, model, this.options)
      .pipe(
        map((response) => response)
      );
  }

  public postFile(url: string, formData: FormData, options?: Partial<HttpOptions>)
    : Observable<any> {

    return this._httpClient.post(url, formData)
      .pipe(
        map((response) => response)
      );
  }

  public put<T>(url: string, model: T, options?: Partial<HttpOptions>)
    : Observable<any> {
    this.configureOptions(options);

    return this._httpClient.put(url, model, this.options)
      .pipe(
        map((response) => response)
      );
  }

  public delete(url: string, id: any, options?: Partial<HttpOptions>)
    : Observable<any> {
    this.configureOptions(options);

    return this._httpClient.delete(`${url}/${id}`, this.options)
      .pipe(
        map((response) => response),
        // catchError((error) =>
        //   of(this.handleError(error))
        // )
      );
  }

  public async postMultipartWithoutModel<T>(endpoint: string, formData: any) {
    try {
      const response = await firstValueFrom(this._httpClient.post<any>(endpoint, formData, { reportProgress: true, observe: 'response' }));
      return response as HttpResponse<any>;
    } catch (ex: any) {
      return await this.handleError(ex);
    }
  }

  downloadFile(url: string, fileDownloadName: string): void {
    this._httpClient.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);

        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        downloadLink.setAttribute('download', fileDownloadName);

        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error.error)
    throw new Error(error.message);
  }
}