import {Component, OnInit} from '@angular/core';
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {BaseInfoFacade} from "../../../../data-core/base-info/base-info.facade";
import {StorageService} from "../../../../utils/storage.service";
import {ActivatedRoute} from "@angular/router";
import {FetchFormDataDTO} from "../../../../models/DTOs/fetch-form-data.DTO";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../../../constants/keys";
import {ColDef} from "ag-grid-community";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

  subscription: Subscription[] = []

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey);
  selectedService = this.storageService.getSessionStorage(selectedServiceKey);
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey);
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey);

  columnDefs: ColDef[] = []
  data: any[] = []

  constructor(
    private baseInfoFacade: BaseInfoFacade,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.baseInfoFacade.form$.subscribe(async form => {

      const payload = new FetchFormDataDTO(
        this.selectedCustomer.id,
        // this.selectedService?.serviceType.id,
        24,
        form.id,
        form.formKind.id,
        this.selectedService.id,
        // selectedUnitId,
        71,
        this.selectedPeriod.id
      )
      await this.baseInfoFacade.fetchFormData(payload)
      this.baseInfoFacade.formData$.subscribe(formData => {
        form.fields.forEach(item => {
          const col: ColDef = {field: item.name}
          this.columnDefs.push(col)
        })
        // this.data = formData as any[]
        console.log(this.columnDefs)
        console.log(this.data)
        // console.log(form)
        // console.log(formData)

      })
    )
  }

}
