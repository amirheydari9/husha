import {Component, NgModule, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {CustomPickListModule} from "../../../ui-kits/custom-pick-list/custom-pick-list.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {ColDef, GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <app-custom-pick-list [formControl]="control" [source]="dynamicDialogConfig.data.source.cols"></app-custom-pick-list>
    <div class="mt-5">
      <app-custom-grid
        [columnDefs]="colDefs"
        [rowData]="dynamicDialogConfig.data.source.data"
        [gridOptions]="gridOptions"
      ></app-custom-grid>
    </div>
    <app-dynamic-dialog-actions
      [disabled]="control.invalid"
      (confirmed)="handleConfirm()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  control: FormControl

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
    this.control = this.fb.control([], [Validators.required])
    this.control.valueChanges.subscribe(data => this.colDefs = [...data])
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
    ReactiveFormsModule,
    CustomGridModule
  ],
  exports: [ExportExcelDialogComponent]
})
export class ExportExcelDialogModule {

}
