import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create.component';
import {RouterModule} from "@angular/router";
import {GeneralFormModule} from "../../../../components/general-form/general-form.component";


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    GeneralFormModule
  ]
})
export class CreateModule {
}
