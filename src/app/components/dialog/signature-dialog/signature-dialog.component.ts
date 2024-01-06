import {Component, NgModule, OnInit} from '@angular/core';
import {IFetchFormRes} from "../../../models/interface/fetch-form-res.interface";
import {SignReqDTO} from "../../../models/DTOs/sign-req.DTO";
import {HushaCustomerUtilService} from "../../../utils/husha-customer-util.service";
import {BaseInfoService} from "../../../api/base-info.service";
import {GridActionsModule} from "../../grid-actions/grid-actions.component";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {ACCESS_FORM_ACTION_TYPE} from "../../../constants/enums";
import {ColDef, GridOptions} from "ag-grid-community";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-signature-dialog',
  template: `
    <app-grid-actions
      [showSearch]="false"
      [accessFormActions]="accessFormActions"
      (onAction)="handleOnAction($event)"
    ></app-grid-actions>
    <!--<app-custom-grid-->
    <!--&gt;</app-custom-grid>-->
  `,
})
export class SignatureDialogComponent implements OnInit {

  subscription: Subscription[] = []


  accessFormActions: ACCESS_FORM_ACTION_TYPE[] = [
    ACCESS_FORM_ACTION_TYPE.SIGNATURE,
    ACCESS_FORM_ACTION_TYPE.RETURN_SIGNATURE
  ]

  form: IFetchFormRes
  colDefs: ColDef[] = []
  gridOptions: GridOptions = {
    pagination: false
  }

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.dynamicDialogConfig.closable = true
    this.dynamicDialogConfig.header = 'تاریخچه امضا'
  }

  ngOnInit() {
    console.log(this.dynamicDialogConfig.data)
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
      123,
    )
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    if ($event === ACCESS_FORM_ACTION_TYPE.SIGNATURE) {
      this.handleSign()
    } else {
      this.handleReturnSign()

    }
  }

  handleSign() {
    this.subscription.push(
      this.baseInfoService.sign(this.handleCreateSignPayload()).subscribe(data => {
        console.log(data)
      })
    )

  }

  handleReturnSign() {
    this.subscription.push(
      this.baseInfoService.returnSign(this.handleCreateSignPayload()).subscribe(data => {
        console.log(data)
      })
    )
  }
}

@NgModule({
  declarations: [SignatureDialogComponent],
  imports: [
    GridActionsModule,
    CustomGridModule
  ],
  exports: [SignatureDialogComponent]
})
export class SignatureDialogModule {

}
