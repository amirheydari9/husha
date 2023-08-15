import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoComponent} from './base-info.component';
import {RouterModule} from "@angular/router";
import {CrudFormModule} from "../../../../components/crud-form/crud-form.component";


@NgModule({
  declarations: [
    BaseInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: BaseInfoComponent}]),
    CrudFormModule
  ]
})
export class BaseInfoModule {
}
