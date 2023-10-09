import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {dynamicField} from "../../../../components/dynamic-form/dynamic-form.component";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {FetchFormDataDTO} from "../../../../models/DTOs/fetch-form-data.DTO";
import {FORM_KIND} from "../../../../constants/enums";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../../../constants/keys";
import {IGetServicesRes} from "../../../../models/interface/get-services-res.interface";
import {StorageService} from "../../../../utils/storage.service";
import {BaseInfoService} from "../../../../api/base-info.service";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";

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
    private cdr: ChangeDetectorRef
  ) {
  }

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey)
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey)

   ngOnInit(): void {
    this.subscription.push(
      this.activatedRoute.params.subscribe(params => {
        this.containerRef.clear()
        this.subscription.push(
          this.baseInfoService.getFormDataById(this.handleCreatePayload(this.activatedRoute.snapshot.data['data'])).subscribe(data => {
            const model = this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data'].fields, data)
            const tempRef = this.templateRef.createEmbeddedView({context: model})
            this.containerRef.insert(tempRef)
          })
        )
      })
    )
  }

  handleCreatePayload(form: IFetchFormRes) {
    return new FetchFormDataDTO(
      this.selectedCustomer.id,
      form.id,
      form.formKind.id,
      // TODO this.selectedService.id,
      101,
      // TODO this.selectedUnit.id,
      71,
      this.selectedPeriod.id,
      // TODO this.selectedService?.serviceType.id,
      form.formKind.id === FORM_KIND.FLAT || form.formKind.id === FORM_KIND.MULTI_LEVEL ? 24 : null,
      null,
      null,
      null,
      null,
      null,
      +this.activatedRoute.snapshot.params['data']
    )
  }


}
