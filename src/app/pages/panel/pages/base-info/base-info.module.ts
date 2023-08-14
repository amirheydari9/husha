import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoComponent} from './base-info.component';
import {RouterModule} from "@angular/router";
import {BaseInfoStore} from "../../../../data-core/base-info/base-info.store";
import {HushaGridModule} from "../../../../ui-kits/husha-grid/husha-grid.component";


@NgModule({
  declarations: [
    BaseInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: BaseInfoComponent}]),
    BaseInfoStore,
    HushaGridModule
  ]
})
export class BaseInfoModule {
}
