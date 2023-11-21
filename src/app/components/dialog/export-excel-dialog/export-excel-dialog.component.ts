import {Component, NgModule, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {CustomPickListModule} from "../../../ui-kits/custom-pick-list/custom-pick-list.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <app-custom-pick-list [formControl]="control" [source]="dynamicDialogConfig.data.source"></app-custom-pick-list>
    <app-dynamic-dialog-actions
      [disabled]="control.invalid"
      (confirmed)="handleConfirm()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  control: FormControl

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
  }


  ngOnInit(): void {
    this.control = this.fb.control([], [Validators.required])
  }

  handleConfirm() {
    console.log(this.control.value)
  }
}

@NgModule({
  declarations: [ExportExcelDialogComponent],
  imports: [
    DynamicDialogActionsModule,
    CustomPickListModule,
    ReactiveFormsModule
  ],
  exports: [ExportExcelDialogComponent]
})
export class ExportExcelDialogModule {

}
