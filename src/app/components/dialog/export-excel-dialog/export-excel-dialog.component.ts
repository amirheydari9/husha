import {Component, NgModule, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {CustomPickListModule} from "../../../ui-kits/custom-pick-list/custom-pick-list.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {ColDef, GridOptions} from "ag-grid-community";
import {CustomDropdownModule} from "../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {downloadTypeOptions} from "../../../constants/enums";
import {BaseInfoService} from "../../../api/base-info.service";
import {FetchAllDataPayloadDTO, HushaGridUtilService} from "../../../utils/husha-grid-util.service";

@AutoUnsubscribe()
@Component({
  selector: 'app-export-excel-dialog',
  template: `
    <form [formGroup]="exportExcelForm">
      <div class="col-4">
        <app-custom-dropdown
          formControlName="downloadType"
          [options]="downloadTypeOptions"
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
      [disabled]="exportExcelForm.invalid"
      (confirmed)="handleConfirm()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
})
export class ExportExcelDialogComponent implements OnInit {

  exportExcelForm: FormGroup
  subscription: Subscription

  colDefs: ColDef[] = []
  gridOptions: GridOptions = {
    pagination: false
  }
  downloadTypeOptions = downloadTypeOptions

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    private baseInfoService: BaseInfoService,
    private hushaGridUtilService: HushaGridUtilService
  ) {
    this.dynamicDialogConfig.closable = true
    this.dynamicDialogConfig.header = 'خروجی اکسل'
  }


  ngOnInit(): void {
    this.exportExcelForm = this.fb.group({
      downloadType: this.fb.control(null, [Validators.required]),
      pickList: this.fb.control([], [Validators.required])
    })
    this.subscription = this.exportExcelForm.controls['pickList'].valueChanges.subscribe(data => this.colDefs = [...data])
  }

  handleConfirm() {
    const payload = new FetchAllDataPayloadDTO(
      this.dynamicDialogConfig.data.source.form,
      this.dynamicDialogConfig.data.source.parentId,
      this.dynamicDialogConfig.data.source.masterId,
      null,
      null,
      null,
      null,
      this.exportExcelForm.controls['downloadType'].value,
      this.exportExcelForm.controls['pickList'].value.map(item => item.field).join(',')
    )
    this.baseInfoService.downloadFormData(this.hushaGridUtilService.handleCreatePayloadForFetchAllData(payload)).subscribe()
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
