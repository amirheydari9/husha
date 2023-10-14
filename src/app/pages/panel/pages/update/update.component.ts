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
                console.log(data)
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
