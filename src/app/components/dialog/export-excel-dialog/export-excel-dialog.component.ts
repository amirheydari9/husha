import {Component, NgModule, OnInit} from '@angular/core';
import {CustomDialogModule} from "../../../ui-kits/custom-dialog/custom-dialog.component";
import {dynamicField, DynamicFormModule} from "../../dynamic-form/dynamic-form.component";
import {DYNAMIC_FORM_RULES, INPUT_FIELD_TYPE} from "../../../constants/enums";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";

@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <app-dynamic-form #dynamicForm [model]="[model]"></app-dynamic-form>
    <app-dynamic-dialog-actions
      [disabled]="!dynamicForm.valid"
      (confirmed)="handleConfirm(dynamicForm.value)"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  model: dynamicField[] = []

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.model = [
      {
        type: INPUT_FIELD_TYPE.PICKLIST,
        value: [],
        name: 'picklist',
        rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true},
        meta: {source: dynamicDialogConfig.data.source}
      }
    ]
  }


  ngOnInit(): void {

  }

  handleConfirm(value: any) {
    console.log(value)
  }
}

@NgModule({
  declarations: [ExportExcelDialogComponent],
  imports: [
    CustomDialogModule,
    DynamicFormModule,
    DynamicDialogActionsModule
  ],
  exports: [ExportExcelDialogComponent]
})
export class ExportExcelDialogModule {

}
