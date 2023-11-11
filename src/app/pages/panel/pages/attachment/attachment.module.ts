import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {AttachmentComponent} from './attachment.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CustomInputTextModule} from "../../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomTextAreaModule} from "../../../../ui-kits/custom-text-area/custom-text-area.component";
import {CustomUploadFileModule} from "../../../../ui-kits/custom-upload-file/custom-upload-file.component";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";
import {GeneralFormModule} from "../../../../components/general-form/general-form.component";
import {AgGridModule} from "ag-grid-angular";


@NgModule({
  declarations: [
    AttachmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AttachmentComponent}]),
    ReactiveFormsModule,
    CustomInputTextModule,
    CustomTextAreaModule,
    CustomUploadFileModule,
    CustomButtonModule,
    GeneralFormModule,
    AgGridModule,
  ],
})
export class AttachmentModule {
}
