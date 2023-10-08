import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateComponent} from './update.component';
import {RouterModule} from "@angular/router";
import {DynamicFormModule} from "../../../../components/dynamic-form/dynamic-form.component";


@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UpdateComponent}]),
    DynamicFormModule
  ]
})
export class UpdateModule {
}
