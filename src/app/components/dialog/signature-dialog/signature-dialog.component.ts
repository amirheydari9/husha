import {Component, NgModule, OnInit} from '@angular/core';
import {SignReqDTO} from "../../../models/DTOs/sign-req.DTO";
import {HushaCustomerUtilService} from "../../../utils/husha-customer-util.service";
import {BaseInfoService} from "../../../api/base-info.service";
import {GridActionsModule} from "../../grid-actions/grid-actions.component";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {ACCESS_FORM_ACTION_TYPE, DOC_STATUS, FORM_KIND} from "../../../constants/enums";
import {ColDef, GridOptions} from "ag-grid-community";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {DateService} from "../../../utils/date.service";
import {TemporaryRegistrationReqDTO} from "../../../models/DTOs/temporary-registration-req.DTO";
import {JalaliDatePipeModule} from "../../../pipes/jalali-date.pipe";
import {DividerModule} from "primeng/divider";
import {CommonModule} from "@angular/common";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-signature-dialog',
  template: `

    <div class="flex align-items-center justify-content-between">
      <div class="flex-grow-1" *ngIf="this.currentRow['create_userid']">
        <span> ایجاد سند توسط: </span>
        <span class="font-sm-bold">{{this.currentRow['create_userid']['username']}}</span>
        <span>درتاریخ  : </span>
        <span class="font-sm-bold" dir="ltr"> {{this.currentRow['create_time']|jalaliDate:'number':'YYYY-MM-DD'}} </span>
      </div>
      <div class="flex-grow-1" *ngIf="this.currentRow['change_userid']">
        <span> تایید سند توسط: </span>
        <span class="font-sm-bold">{{this.currentRow['change_userid']['username']}}</span>
        <span>درتاریخ  : </span>
        <span class="font-sm-bold" dir="ltr"> {{this.currentRow['change_time']|jalaliDate:'number':'YYYY-MM-DD'}} </span>
      </div>
    </div>

    <app-grid-actions
      [showSearch]="false"
      [accessFormActions]="accessFormActions"
      (onAction)="handleOnAction($event)"
    ></app-grid-actions>
    <app-custom-grid
      [columnDefs]="colDefs"
      [rowData]="rowData"
      [gridOptions]="gridOptions"
    ></app-custom-grid>
  `,
})
export class SignatureDialogComponent implements OnInit {

  subscription: Subscription[] = []

  accessFormActions: ACCESS_FORM_ACTION_TYPE[] = [
    ACCESS_FORM_ACTION_TYPE.SIGNATURE,
    ACCESS_FORM_ACTION_TYPE.RETURN_SIGNATURE
  ]

  colDefs: ColDef[] = [
    {headerName: 'نام کاربری', field: 'username'},
    {headerName: 'پوزیشن', field: 'position'},
    {headerName: 'تاریخ امضا', field: 'signTime'}
  ]
  rowData = []
  currentRow: any
  gridOptions: GridOptions = {
    pagination: false
  }

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private dateService: DateService,
  ) {
    this.dynamicDialogConfig.closable = true
    this.dynamicDialogConfig.header = 'تایید سند و امضاها'
  }

  ngOnInit() {
    this.handleCreateRowData(this.dynamicDialogConfig.data.row)
  }

  handleCreateRowData(item) {
    const rowData = []
    for (let i = 1; i <= item['signCount']; i++) {
      if (!item['sign' + i + '_userid']) {
        break
      }
      rowData.push({
        username: item['sign' + i + '_userid'].username,
        position: item['sign' + i + 'Position'].title,
        signTime: this.dateService.timestampToJalali(item['sign' + i + '_time'])
      })
    }
    this.currentRow = item
    this.rowData = rowData
  }

  handleCreateSignPayload() {
    //TODO هندل position id
    return new SignReqDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      this.dynamicDialogConfig.data.form.id,
      this.dynamicDialogConfig.data.form.formKind.id,
      this.hushaCustomerUtilService.serviceTypeId,
      this.dynamicDialogConfig.data.row.id,
      2,
    )
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    if ($event === ACCESS_FORM_ACTION_TYPE.SIGNATURE) {
      if (this.currentRow['doc_status']['id'] === DOC_STATUS.DRAFT) {
        this.handleTemporaryRegistration()
      } else {
        this.handleSign()
      }
    } else {
      this.handleReturnSign()
    }
  }

  handleTemporaryRegistration() {
    //TODO detailFormId
    const payload = new TemporaryRegistrationReqDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      this.dynamicDialogConfig.data.form.id,
      this.dynamicDialogConfig.data.form.formKind.id,
      this.dynamicDialogConfig.data.row.id,
      101203,
      FORM_KIND.DETAIL,
    )
    this.subscription.push(
      this.baseInfoService.temporaryRegistration(payload).subscribe(data => this.handleCreateRowData(data))
    )
  }

  handleSign() {
    this.subscription.push(
      this.baseInfoService.sign(this.handleCreateSignPayload()).subscribe(data => this.handleCreateRowData(data))
    )
  }

  handleReturnSign() {
    this.subscription.push(
      this.baseInfoService.returnSign(this.handleCreateSignPayload()).subscribe(data => this.handleCreateRowData(data))
    )
  }
}

@NgModule({
  declarations: [SignatureDialogComponent],
  imports: [
    GridActionsModule,
    CustomGridModule,
    JalaliDatePipeModule,
    DividerModule,
    CommonModule
  ],
  exports: [SignatureDialogComponent]
})
export class SignatureDialogModule {

}
