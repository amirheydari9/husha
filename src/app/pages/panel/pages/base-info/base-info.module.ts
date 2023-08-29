import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoComponent} from './base-info.component';
import {RouterModule} from "@angular/router";
import {HushaGridModule} from "../../../../ui-kits/husha-grid/husha-grid.component";
import {AgGridModule} from "ag-grid-angular";


@NgModule({
  declarations: [
    BaseInfoComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([{path: '', component: BaseInfoComponent}]),
        HushaGridModule,
        AgGridModule
    ]
})
export class BaseInfoModule {
}
