import {Component, NgModule} from '@angular/core';
import {dynamicField, DynamicFormModule} from "../../dynamic-form/dynamic-form.component";
import {DYNAMIC_FORM_RULES, INPUT_FIELD_TYPE} from "../../../constants/enums";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-attachment-dialog',
  template: `
    <app-dynamic-form #dynamicForm [model]="[model]"></app-dynamic-form>
    <app-dynamic-dialog-actions
      [disabled]="!dynamicForm?.valid"
      (confirmed)="ref.close(dynamicForm?.value)"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class AttachmentDialogComponent {

  model: dynamicField[] = []

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    const attachment = dynamicDialogConfig.data.attachment
    this.model = [
      {
        value: attachment ? attachment['name'] : null,
        label: 'نام فایل',
        name: 'name',
        type: INPUT_FIELD_TYPE.TEXT,
        rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true}
      },
      {
        value: attachment ? attachment['desc'] : null,
        label: 'توضیحات',
        name: 'desc',
        type: INPUT_FIELD_TYPE.TEXT_AREA,
        rules: {[DYNAMIC_FORM_RULES.MAX_LENGTH]: 300}
      }
    ]
    if (!attachment) {
      this.model = [
        this.model[0],
        {
          value: null,
          label: 'فایل',
          name: 'data',
          type: INPUT_FIELD_TYPE.FILE,
          rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true}
        },
        this.model[1]
      ]
    }
  }
}

@NgModule({
  declarations: [AttachmentDialogComponent],
  imports: [
    DynamicFormModule,
    DynamicDialogActionsModule
  ],
  exports: [AttachmentDialogComponent]
})
export class AttachmentDialogModule {

}
