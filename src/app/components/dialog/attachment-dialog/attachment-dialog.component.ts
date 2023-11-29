import {Component, NgModule, OnInit} from '@angular/core';
import {dynamicField} from "../../dynamic-form/dynamic-form.component";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomInputTextModule} from "../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomUploadFileModule} from "../../../ui-kits/custom-upload-file/custom-upload-file.component";
import {CustomTextAreaModule} from "../../../ui-kits/custom-text-area/custom-text-area.component";
import {AttachmentRes} from "../../../models/interface/attachment-res.interface";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-attachment-dialog',
  template: `
    <form [formGroup]="form" class="flex align-items-end flex-wrap">
      <div class="col-12">
        <app-custom-upload-file
          formControlName="data"
        ></app-custom-upload-file>
      </div>
      <div class="col-12">
        <app-custom-input-text
          formControlName="name"
          label="نام فایل"
        ></app-custom-input-text>
      </div>
      <div class="col-12">
        <app-custom-text-area
          formControlName="desc"
          label="توضیحات"
        ></app-custom-text-area>
      </div>
    </form>
    <app-dynamic-dialog-actions
      [disabled]="form.invalid"
      (confirmed)="ref.close(form.value)"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class AttachmentDialogComponent implements OnInit {

  model: dynamicField[] = []
  form: FormGroup
  attachment: AttachmentRes

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.attachment = this.dynamicDialogConfig.data.attachment
    this.form = this.fb.group({
      name: this.fb.control(this.attachment ? this.attachment.name : null, [Validators.required]),
      data: this.fb.control(null, !this.attachment ? Validators.required : null),
      desc: this.fb.control(this.attachment ? this.attachment.desc : null, [Validators.maxLength(300)]),
    })
  }
}

@NgModule({
  declarations: [AttachmentDialogComponent],
  imports: [
    DynamicDialogActionsModule,
    ReactiveFormsModule,
    CustomInputTextModule,
    CustomUploadFileModule,
    CustomTextAreaModule,
    CommonModule,
  ],
  exports: [AttachmentDialogComponent]
})
export class AttachmentDialogModule {

}
