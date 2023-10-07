import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create.component';
import {RouterModule} from "@angular/router";
import {DynamicFormModule} from "../../../../components/dynamic-form/dynamic-form.component";


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    DynamicFormModule
  ]
})
export class CreateModule {
}
