import {Component, NgModule, OnInit} from '@angular/core';
import {dynamicField} from "../../dynamic-form/dynamic-form.component";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomInputTextModule} from "../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomUploadFileModule} from "../../../ui-kits/custom-upload-file/custom-upload-file.component";
import {CustomTextAreaModule} from "../../../ui-kits/custom-text-area/custom-text-area.component";
import {AttachmentRes} from "../../../models/interface/attachment-res.interface";
import {CommonModule} from "@angular/common";
import {FileService} from "../../../utils/file.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-attachment-dialog',
  template: `
    <form [formGroup]="form" class="flex align-items-end flex-wrap">
      <div class="col-12">
        <app-custom-upload-file
          formControlName="file"
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
      (confirmed)="handleClose()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class AttachmentDialogComponent implements OnInit {

  model: dynamicField[] = []
  form: FormGroup
  attachment: AttachmentRes
  fileType: string
  subscription: Subscription

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    private fileService: FileService
  ) {

  }

  ngOnInit() {
    this.attachment = this.dynamicDialogConfig.data.attachment
    this.fileType = this.attachment ? this.attachment.name.split('.').pop() : undefined
    this.form = this.fb.group({
      name: this.fb.control(this.attachment?.name.split('.')[0], [Validators.required]),
      file: this.fb.control(null, !this.attachment ? Validators.required : null),
      desc: this.fb.control(this.attachment ? this.attachment.desc : null, [Validators.maxLength(300)]),
    })

    this.subscription = this.fileCtrl.valueChanges.subscribe(selectedFile => {
      if (selectedFile) {
        this.fileType = selectedFile.name.split('.').pop()
        this.nameCtrl.setValue(selectedFile.name.split('.')[0])
      } else {
        this.nameCtrl.setValue(this.attachment?.name.split('.')[0])
      }
    })

  }

  get nameCtrl(): FormControl {
    return this.form.controls['name'] as FormControl
  }

  get fileCtrl(): FormControl {
    return this.form.controls['file'] as FormControl
  }


  async handleClose() {
    const payload = {
      name: this.nameCtrl.value.concat(`.${this.fileType}`),
      data: this.fileCtrl.value ? (await this.fileService.convertFileToBase64(this.fileCtrl.value)) : this.attachment.data,
      desc: this.form.controls['desc'].value
    }
    this.ref.close(payload)
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
