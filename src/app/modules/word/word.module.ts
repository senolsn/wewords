import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WordRoutingModule } from "./word-routing.module";
import { WordComponent } from "./word.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [WordComponent],
  imports: [CommonModule, WordRoutingModule,FormsModule],
})
export class WordModule {}
