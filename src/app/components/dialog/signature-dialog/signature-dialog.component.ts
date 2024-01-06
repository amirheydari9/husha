import {Component, NgModule} from '@angular/core';
import {IFetchFormRes} from "../../../models/interface/fetch-form-res.interface";
import {SignReqDTO} from "../../../models/DTOs/sign-req.DTO";
import {HushaCustomerUtilService} from "../../../utils/husha-customer-util.service";
import {BaseInfoService} from "../../../api/base-info.service";

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.scss']
})
export class SignatureDialogComponent {

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService,
  ) {
  }

  handleCreateSignPayload(form: IFetchFormRes, ownId: number) {
    //TODO هندل position id
    return new SignReqDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      form.id,
      form.formKind.id,
      this.hushaCustomerUtilService.serviceTypeId,
      ownId,
      123,
      1
    )
  }

}

@NgModule({
  declarations: [SignatureDialogComponent],
  imports: [],
  exports: [SignatureDialogComponent]
})
export class SignatureDialogModule {

}
