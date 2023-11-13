import {ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {CustomDialogModule} from "../../../ui-kits/custom-dialog/custom-dialog.component";
import {CustomPickListModule} from "../../../ui-kits/custom-pick-list/custom-pick-list.component";
import {dynamicField, DynamicFormModule} from "../../dynamic-form/dynamic-form.component";
import {DYNAMIC_FORM_RULES, INPUT_FIELD_TYPE} from "../../../constants/enums";

@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <app-custom-dialog
      header="خروجی اکسل"
      (closed)="visibleChange.emit(false)"
      (confirmed)="handleConfirm(dynamicForm.dynamicFormGroup.getRawValue())"
      [disabled]="disabled"
      [showDialog]="visible">
      <app-dynamic-form
        (onValid)="disabled= !$event;cdr.detectChanges()"
        #dynamicForm [model]="[model]"></app-dynamic-form>
    </app-custom-dialog>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  model: dynamicField[] = []
  disabled: boolean

  @Input() set source(data) {
    this.model = [
      {
        type: INPUT_FIELD_TYPE.PICKLIST,
        value: [],
        name: 'picklist',
        rules: {[DYNAMIC_FORM_RULES.REQUIRED]: true},
        meta: {source: data}
      }
    ]
  }

  @Input() visible: boolean = false
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    public cdr: ChangeDetectorRef
  ) {
  }


  ngOnInit(): void {

  }

  handleConfirm($event) {
    console.log($event)
  }
}

@NgModule({
  declarations: [ExportExcelDialogComponent],
  imports: [
    CustomDialogModule,
    CustomPickListModule,
    DynamicFormModule
  ],
  exports: [ExportExcelDialogComponent]
})
export class ExportExcelDialogModule {

}
