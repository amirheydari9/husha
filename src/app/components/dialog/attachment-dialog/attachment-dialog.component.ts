import {ChangeDetectorRef, Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {dynamicField, DynamicFormModule} from "../../dynamic-form/dynamic-form.component";
import {DYNAMIC_FORM_RULES, INPUT_FIELD_TYPE} from "../../../constants/enums";
import {CustomDialogModule} from "../../../ui-kits/custom-dialog/custom-dialog.component";
import {IFetchFormRes} from "../../../models/interface/fetch-form-res.interface";
import {AttachmentRes} from "../../../models/interface/attachment-res.interface";

@Component({
  selector: 'app-attachment-dialog',
  template: `
    <app-custom-dialog
      [header]="attachment ? 'ویرایش ضمیمه' :'ضمیمه جدید'"
      (closed)="handleClosed()"
      (confirmed)="handleClosed(dynamicForm.dynamicFormGroup.getRawValue())"
      [disabled]="disabled"
      [showDialog]="visible">
      <app-dynamic-form
        (onValid)="disabled= !$event;cdr.detectChanges()"
        #dynamicForm
        [model]="[model]"
        (onSubmit)="handleClosed($event)"
      ></app-dynamic-form>
    </app-custom-dialog>`,
})
export class AttachmentDialogComponent {

  @Input() form: IFetchFormRes
  @Input() visible: boolean = false
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() onHide: EventEmitter<any> = new EventEmitter<any>()

  model: dynamicField[] = []
  disabled: boolean

  private _attachment: AttachmentRes;
  @Input() set attachment(data: AttachmentRes) {
    this.model = [
      {
        value: data ? data['name'] : null,
        label: 'نام فایل',
        name: 'name',
        type: INPUT_FIELD_TYPE.TEXT,
        rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true}
      },
      {
        value: data ? data['data'] : null,
        label: 'فایل',
        name: 'data',
        type: INPUT_FIELD_TYPE.FILE,
        rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true}
      },
      {
        value: data ? data['desc'] : null,
        label: 'توضیحات',
        name: 'desc',
        type: INPUT_FIELD_TYPE.TEXT_AREA,
        rules:{[DYNAMIC_FORM_RULES.MAX_LENGTH]:300}
      }
    ]
    this._attachment = data
  }

  get attachment(): AttachmentRes {
    return this._attachment
  }

  constructor(
    public cdr: ChangeDetectorRef
  ) {
  }

  handleClosed(data?: any) {
    this.visibleChange.emit(false)
    this.onHide.emit(data)
  }
}

@NgModule({
  declarations: [AttachmentDialogComponent],
  imports: [
    CustomDialogModule,
    DynamicFormModule
  ],
  exports: [AttachmentDialogComponent]
})
export class AttachmentDialogModule {

}
