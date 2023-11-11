import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateComponent} from './update.component';
import {RouterModule} from "@angular/router";
import {GeneralFormModule} from "../../../../components/general-form/general-form.component";

@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UpdateComponent}]),
    GeneralFormModule
  ]
})
export class UpdateModule {
}
