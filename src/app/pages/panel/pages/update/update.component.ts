import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchFormDataByIdDTO} from "../../../../models/DTOs/fetch-form-data-by-id.DTO";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  subscription: Subscription [] = []

  @ViewChild('containerRef', {read: ViewContainerRef, static: true}) containerRef: ViewContainerRef
  @ViewChild('templateRef', {read: TemplateRef, static: true}) templateRef: TemplateRef<any>

  constructor(
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService,
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
  }

  async ngOnInit(): Promise<void> {
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
            +params['data']
          )
          this.baseInfoService.fetchFormData(payload).subscribe(async data => {
            const model = await this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data'].fields, data);
            const tempRef = this.templateRef.createEmbeddedView({context: model});
            this.containerRef.insert(tempRef);
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
