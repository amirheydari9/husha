import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {selectedCustomerKey} from "../../../../constants/keys";
import {StorageService} from "../../../../utils/storage.service";
import {BaseInfoService} from "../../../../api/base-info.service";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {FetchFormDataByIdDTO} from "../../../../models/DTOs/fetch-form-data-by-id.DTO";

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
    private storageService: StorageService,
    private baseInfoService: BaseInfoService,
  ) {
  }

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)

  async ngOnInit(): Promise<void> {
    this.subscription.push(
      this.activatedRoute.params.subscribe(async params => {
        this.containerRef.clear();
        try {
          this.baseInfoService.fetchFormData(this.handleCreatePayload(this.activatedRoute.snapshot.data['data'])).subscribe(async data => {
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

  handleCreatePayload(form: IFetchFormRes) {
    return new FetchFormDataByIdDTO(
      this.selectedCustomer.id,
      // TODO this.selectedService?.serviceType.id,
      24,
      form.id,
      form.formKind.id,
      +this.activatedRoute.snapshot.params['data']
    )
  }

  handleOnSubmit($event: any) {
    console.log('asas')
  }
}
