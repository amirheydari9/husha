import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {DynamicFormComponent} from "../../../../components/dynamic-form/dynamic-form.component";
import {BaseInfoService} from "../../../../api/base-info.service";
import {AddFormDataReqDTO} from "../../../../models/DTOs/add-form-data-req.DTO";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";
import {FORM_KIND} from "../../../../constants/enums";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";

@Component({
  selector: 'app-create',
  template: `
    <ng-container #containerRef></ng-container>`,
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements AfterViewInit {

  subscription: Subscription [] = []

  @ViewChild('containerRef', {read: ViewContainerRef}) containerRef: ViewContainerRef

  // data = [
  //   {order: 0, name: 'ali', age: 20},
  //   {order: 0, name: 'amir', age: 20},
  //   {order: 1, name: 'saeed', age: null},
  //   {order: 2, name: 'reza', age: 10},
  //   {order: 2, name: 'reza1', age: 10},
  //   {order: 2, name: 'reza2', age: 10},
  //   {order: 2, name: 'reza3', age: 10},
  //   {order: 2, name: 'reza4', age: 10},
  //   {order: 2, name: 'reza5', age: 10},
  // ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService,
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    this.subscription.push(
      this.activatedRoute.params.subscribe(async params => {
        this.containerRef.clear();
        try {
          const form: IFetchFormRes = this.activatedRoute.snapshot.data['data']
          const model = await this.hushaFormUtilService.createModel(form);
          const comRef = this.containerRef.createComponent(DynamicFormComponent)
          comRef.setInput('model', model)
          this.subscription.push(
            comRef.instance.onSubmit.subscribe(data => {
              this.baseInfoService.addFormData(this.handleCreatePayload(form), data).subscribe(res => {
                console.log(res)
              })
            })
          )
        } catch (e) {
          console.log(e)
        }
      })
    )
  }

  handleCreatePayload(form: IFetchFormRes) {
    //TODO هند کردن masterId برای دیتیل گرید
    const formKindId = form.formKind.id
    return new AddFormDataReqDTO(
      form.id,
      formKindId,
      formKindId === FORM_KIND.DETAIL ? null : this.hushaCustomerUtilService.customer.id,
      formKindId === FORM_KIND.MULTI_LEVEL || formKindId === FORM_KIND.FLAT ? this.hushaCustomerUtilService.serviceTypeId : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.service.id : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
      // formKindId === FORM_KIND.DETAIL ? form.masterId : null,
    )
  }
}
