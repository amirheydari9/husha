import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiKitListComponent} from './ui-kit-list.component';
import {RouterModule} from "@angular/router";
import {CustomInputNumberModule} from "../../ui-kits/custom-input-number/custom-input-number.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CustomJalaliDatePickerModule} from "../../ui-kits/custom-jalali-date-picker/custom-jalali-date-picker.component";
import {CustomUploadFileModule} from "../../ui-kits/custom-upload-file/custom-upload-file.component";


@NgModule({
  declarations: [
    UiKitListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UiKitListComponent}]),
    CustomInputNumberModule,
    ReactiveFormsModule,
    CustomJalaliDatePickerModule,
    CustomUploadFileModule,
  ]
})
export class UiKitListModule {
}
