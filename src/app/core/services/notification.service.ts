import { ToastrService } from 'ngx-toastr';
import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable(
  { providedIn: 'root' }
)

export class NotificationService {
  
  constructor(private toastrService: ToastrService,
    private injector: Injector) {
  }

  success = (message: string): void => {
    
    message = this.injector.get(TranslateService).instant(message);
    this.toastrService.success(message)
  }

  info = (message: string): void => {
    message = this.injector.get(TranslateService).instant(message);
    this.toastrService.info(message)
  }

  error = (message: string): void => {
    
    message = this.injector.get(TranslateService).instant(message);
    this.toastrService.error(message)
  }
}
