import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { custom } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  constructor(private translateService: TranslateService) { }

  public async confirmation(message: string): Promise<boolean> {
    let result = false;

    let confirmationDialog = custom({
      title: this.translateService.instant("GLOBAL.WARNING"),
      messageHtml: this.translateService.instant(message),
      buttons: [{
        text: this.translateService.instant("GLOBAL.YES"),
        onClick: (e) => { return true; },
        type:"success",
      },
      {
        text: this.translateService.instant("GLOBAL.NO"),
        onClick: (e) => { return false; },
        type:'danger'
      },
      ]
    });

    await confirmationDialog.show().then((dialogResult: any) => {
      result = dialogResult;
    });

    return result;
  }

  public async information(message: string): Promise<boolean> {
    let result = false;

    let confirmationDialog = custom({
      title: this.translateService.instant("GLOBAL.WARNING"),
      messageHtml: this.translateService.instant(message),
      buttons: [
      {
        text: this.translateService.instant("GLOBAL.YES"),
        onClick: (e) => { return true; },
        type:'success'
      },
      ]
    });

    await confirmationDialog.show().then((dialogResult: any) => {
      result = dialogResult;
    });

    return result;
  }
}


