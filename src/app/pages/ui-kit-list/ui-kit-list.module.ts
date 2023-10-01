import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiKitListComponent} from './ui-kit-list.component';
import {RouterModule} from "@angular/router";
import {CustomInputNumberModule} from "../../ui-kits/custom-input-number/custom-input-number.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CustomDatePickerModule} from "../../ui-kits/custom-date-picker/custom-date-picker.component";


@NgModule({
  declarations: [
    UiKitListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UiKitListComponent}]),
    CustomInputNumberModule,
    ReactiveFormsModule,
    CustomDatePickerModule
  ]
})
export class UiKitListModule {
}
