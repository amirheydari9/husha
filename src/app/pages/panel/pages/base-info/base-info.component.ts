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
import {ActivatedRoute, Router} from "@angular/router";
import {ColDef} from "ag-grid-community";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchFormDTO} from "../../../../models/DTOs/fetch-form.DTO";

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

  columnDefs: ColDef[] = []
  data: any[] = []

  constructor(
    private baseInfoFacade: BaseInfoFacade,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.activatedRoute.params.subscribe(params => {
      this.columnDefs = [];
      this.data = []

      this.baseInfoService.fetchForm(new FetchFormDTO(params['id'])).subscribe(form => {
        const payload = new FetchFormDataDTO(
          this.selectedCustomerId,
          // this.selectedService?.serviceType.id,
          24,
          form.id,
          form.formKind.id,
          // this.selectedService.id,
          101,
          // selectedUnitId,
          71,
          this.selectedPeriodId
        )
        this.baseInfoService.fetchFormData(payload).subscribe(formData => {
          form.fields.forEach(item => {
            const col: ColDef = {field: item.name}
            this.columnDefs.push(col)
          })
          this.data = formData as any[]
        })
      })
    })

  }

}
