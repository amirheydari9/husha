import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoComponent} from './base-info.component';
import {RouterModule} from "@angular/router";
import {HushaGridModule} from "../../../../ui-kits/husha-grid/husha-grid.component";
import {AgGridModule} from "ag-grid-angular";
import {GridActionsModule} from "../../../../components/grid-actions/grid-actions.component";
import {
  MultiLevelGridHistoryModule
} from "../../../../components/multi-level-grid-history/multi-level-grid-history.component";


@NgModule({
  declarations: [
    BaseInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: BaseInfoComponent}]),
    HushaGridModule,
    AgGridModule,
    GridActionsModule,
    MultiLevelGridHistoryModule
  ]
})
export class BaseInfoModule {
}
