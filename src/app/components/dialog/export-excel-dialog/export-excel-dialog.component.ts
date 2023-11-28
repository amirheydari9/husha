import {Component, NgModule, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {CustomPickListModule} from "../../../ui-kits/custom-pick-list/custom-pick-list.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {ColDef, GridOptions} from "ag-grid-community";
import {CustomDropdownModule} from "../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <form [formGroup]="form">
      <div class="col-4">
        <app-custom-dropdown
          formControlName="type"
          [options]="[]"
          label="نوع خروجی"
        ></app-custom-dropdown>
      </div>
      <app-custom-pick-list
        formControlName="pickList"
        [source]="dynamicDialogConfig.data.source.cols"></app-custom-pick-list>
    </form>
    <div class="mt-5">
      <app-custom-grid
        [columnDefs]="colDefs"
        [rowData]="dynamicDialogConfig.data.source.data"
        [gridOptions]="gridOptions"
      ></app-custom-grid>
    </div>
    <app-dynamic-dialog-actions
      [disabled]="form.invalid"
      (confirmed)="handleConfirm()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  form: FormGroup
  subscription: Subscription

  colDefs: ColDef[] = []
  gridOptions: GridOptions = {
    pagination: false
  }

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
  }


  ngOnInit(): void {

    this.form = this.fb.group({
      type: this.fb.control(null, [Validators.required]),
      pickList: this.fb.control([], [Validators.required])
    })
    this.subscription = this.form.controls['pickList'].valueChanges.subscribe(data => this.colDefs = [...data])
  }

  handleConfirm() {
    console.log(this.form.value)
  }
}

@NgModule({
  declarations: [ExportExcelDialogComponent],
  imports: [
    DynamicDialogActionsModule,
    CustomPickListModule,
    ReactiveFormsModule,
    CustomGridModule,
    CustomDropdownModule
  ],
  exports: [ExportExcelDialogComponent]
})
export class ExportExcelDialogModule {

}
