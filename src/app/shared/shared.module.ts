import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbNavModule,NgbAccordionModule,NgbDropdownModule,} from "@ng-bootstrap/ng-bootstrap";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { CountUpModule } from "ngx-countup";
import {
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule,
} from "devextreme-angular";
import { TranslateModule } from "@ngx-translate/core";
import { BaseDataGridComponent } from "../core/components/base-data-grid/base-data-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [BaseDataGridComponent],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
    CountUpModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgApexchartsModule,
  ],
  exports: [
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    TranslateModule,
    BaseDataGridComponent,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgApexchartsModule
  ],
})
export class SharedModule {}
