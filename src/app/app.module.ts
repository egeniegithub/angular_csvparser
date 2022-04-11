import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { MappingTableComponent } from './components/mapping-table/mapping-table.component';
import { SpreadsheetParserComponent } from './components/spreadsheet-parser/spreadsheet-parser.component';
import { AdvanceFeatureComponent } from './components/advance-feature/advance-feature.component';
import { ShowTestComponent } from './show-test/show-test.component';
import { CusModalComponent } from './components/cus-modal/cus-modal.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    MappingTableComponent,
    SpreadsheetParserComponent,
    AdvanceFeatureComponent,
    ShowTestComponent,
    CusModalComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
