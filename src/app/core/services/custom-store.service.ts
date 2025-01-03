import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadOptions } from "devextreme/data";

@Injectable({
  providedIn: 'root'
})
export class CustomStoreService {

  setHttpParams(loadOptions: LoadOptions | any) {
    let params: HttpParams = new HttpParams();
    loadOptions.skip = +loadOptions.skip;
    loadOptions.take = +loadOptions.take;

    [
      'filter',
      'group',
      'groupSummary',
      'parentIds',
      'requireGroupCount',
      'requireTotalCount',
      'searchExpr',
      'searchOperation',
      'searchValue',
      'select',
      'sort',
      'skip',
      'take',
      'totalSummary',
      'userData'
    ].forEach((i: string) => {

      if (i in loadOptions && loadOptions[i] !== undefined && loadOptions[i] !== null && loadOptions[i] !== '') {
        params = params.set(i, JSON.stringify(loadOptions[i]));
      }
    });

    return params;
  }
}