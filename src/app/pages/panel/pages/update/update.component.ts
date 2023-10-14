import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchFormDataByIdDTO} from "../../../../models/DTOs/fetch-form-data-by-id.DTO";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";
import {FORM_KIND} from "../../../../constants/enums";
import {DynamicFormComponent} from "../../../../components/dynamic-form/dynamic-form.component";
import {AddFormDataReqDTO} from "../../../../models/DTOs/add-form-data-req.DTO";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-update',
  template: `
    <ng-container #containerRef></ng-container>
  `,
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements AfterViewInit {

  subscription: Subscription [] = []

  @ViewChild('containerRef', {read: ViewContainerRef}) containerRef: ViewContainerRef

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
          const form = this.activatedRoute.snapshot.data['data']
          const payload = new FetchFormDataByIdDTO(
            this.hushaCustomerUtilService.customer.id,
            this.hushaCustomerUtilService.serviceTypeId,
            form.id,
            form.formKind.id,
            +params['data'],
            form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
            form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
          )
          this.baseInfoService.fetchFormData(payload).subscribe(async data => {
            const model = await this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data'], data);
            const comRef = this.containerRef.createComponent(DynamicFormComponent)
            comRef.setInput('model', model)
            this.subscription.push(
              comRef.instance.onSubmit.subscribe(data => {
                //TODO هند کردن masterId برای دیتیل گرید
                const formKindId = form.formKind.id
                const payload = new AddFormDataReqDTO(
                  form.id,
                  formKindId,
                  formKindId === FORM_KIND.DETAIL ? null : this.hushaCustomerUtilService.customer.id,
                  formKindId === FORM_KIND.MULTI_LEVEL || formKindId === FORM_KIND.FLAT ? this.hushaCustomerUtilService.serviceTypeId : null,
                  formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.service.id : null,
                  formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
                  formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
                  // formKindId === FORM_KIND.DETAIL ? form.masterId : null,
                )
                this.baseInfoService.updateFormData(payload, data).subscribe(res => {
                  console.log(res)
                })
              })
            )
          })
        } catch (error) {
          console.error(error);
        }
      })
    );
  }

  handleOnSubmit($event: any) {
    console.log('asas')
  }
}
