import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoComponent} from './base-info.component';
import {RouterModule} from "@angular/router";
import {BaseInfoStore} from "../../../../data-core/base-info/base-info.store";


@NgModule({
  declarations: [
    BaseInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: BaseInfoComponent}]),
    BaseInfoStore
  ]
})
export class BaseInfoModule {
}
