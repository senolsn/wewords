import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { NotificationService } from "../services/notification.service";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(public notificationService: NotificationService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        const errorMessage: string = response.error.ErrorMessage;

        if (errorMessage !== undefined) {
          this.notificationService.error(errorMessage);
        }
        else {
          let errorMessage = this.getStatusErrorMessage(response);

          if (errorMessage == '') {
            if (response.error instanceof ErrorEvent) {
              errorMessage = `Status Code: ${response.status}, Client Side Error: ${response.error.message}`;
            }
            else {
              errorMessage = `Status Code: ${response.status}, Server Side Error: ${response.message}`;
            }
          }

          this.notificationService.error(errorMessage);
        }

        throw new Error(response.error.message);
      })
    )
  }

  private getStatusErrorMessage(response: HttpErrorResponse): string {
    let errorMessage: string = "";

    
    if (response.status == 400) {
      errorMessage = `Error: ${response.error.message}`;
    }
    else if (response.status == 401) {
      errorMessage = `Status Code: ${response.status}, Error: Unauthorized`;
    }
    else if (response.status == 404) {
      errorMessage = `Status Code: ${response.status}, Error: API Method not found`;
    }
    else if (response.status == 500) {
      errorMessage = `Status Code: ${response.status}, Error: Internal Server Error`;
    }
    else if (response.status == 0) {
      errorMessage = `Status Code: ${response.status}, Error: Sunucuya Erişilemiyor`;
    }
    return errorMessage;
  }
}