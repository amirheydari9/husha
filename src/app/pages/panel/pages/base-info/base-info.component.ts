import {Component, OnInit} from '@angular/core';
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {BaseInfoFacade} from "../../../../data-core/base-info/base-info.facade";
import {FetchFormDataDTO} from "../../../../models/DTOs/fetch-form-data.DTO";
import {StorageService} from "../../../../utils/storage.service";
import {
  selectedCustomerIdKey,
  selectedPeriodIdKey,
  selectedServiceKey,
  selectedUnitIdKey
} from "../../../../constants/keys";
import {IGetServicesRes} from "../../../../models/interface/get-services-res.interface";
import {ActivatedRoute} from "@angular/router";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

  subscription: Subscription[] = []

  selectedCustomerId: number = this.storageService.getSessionStorage(selectedCustomerIdKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnitId: number = this.storageService.getSessionStorage(selectedUnitIdKey)
  selectedPeriodId: number = this.storageService.getSessionStorage(selectedPeriodIdKey)

  constructor(
    private baseInfoFacade: BaseInfoFacade,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.subscription.push(
      this.baseInfoFacade.form$.subscribe(async data => {

        const payload = new FetchFormDataDTO(
          this.selectedCustomerId,
          // this.selectedService?.serviceType.id,
          24,
          data.id,
          data.formKind.id,
          this.selectedService.id,
          // selectedUnitId,
          71,
          this.selectedPeriodId
        )
        await this.baseInfoFacade.fetchFormData(payload)
      })
    )
  }

}
