import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TanimlarRoutingModule } from './tanimlar-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    TanimlarRoutingModule,
    SharedModule,
  ]
})
export class TanimlarModule { }
