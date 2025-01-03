// import { GridGorunum } from "./../../models/grid-gorunum";
import { EventEmitter, Injectable } from "@angular/core";
import { HttpService } from "../../../core/services/http.service";
import { UrlService } from "../../../core/services/url.service";

@Injectable({
  providedIn: "root",
})
export class BaseDataGridService {
  public formName: string;
  public refresh: EventEmitter<any> = new EventEmitter<any>();
  constructor(public urlService: UrlService, private httpService: HttpService) {
  }

  public refreshBaseGrid() {
    this.refresh.emit();
  }

}
