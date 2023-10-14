import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseFormComponent} from './base-form.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    BaseFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: BaseFormComponent}])
  ]
})
export class BaseFormModule {
}
