import {Component, NgModule, OnInit} from '@angular/core';
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../constants/keys";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {ColDef} from "ag-grid-community";
import {StorageService} from "../../utils/storage.service";
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDTO} from "../../models/DTOs/fetch-form.DTO";
import {FetchFormDataDTO} from "../../models/DTOs/fetch-form-data.DTO";
import {HushaGridModule} from "../../ui-kits/husha-grid/husha-grid.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent implements OnInit {

  subscription: Subscription[] = []

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey)
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey)

  columnDefs: ColDef[] = []
  rowData: any[] = []

  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.columnDefs = [];
      this.rowData = []

      this.subscription.push(
        this.baseInfoService.fetchForm(new FetchFormDTO(params['id'])).subscribe(form => {
          const payload = new FetchFormDataDTO(
            this.selectedCustomer.id,
            // this.selectedService?.serviceType.id,
            24,
            form.id,
            form.formKind.id,
            // this.selectedService.id,
            101,
            // this.selectedUnit.id,
            71,
            this.selectedPeriod.id
          )
          this.subscription.push(
            this.baseInfoService.fetchFormData(payload).subscribe(formData => {
              const colDefs: ColDef[] = []
              form.fields.forEach(item => {
                const col: ColDef = {field: item.name}
                colDefs.push(col)
              })
              this.columnDefs = colDefs
              this.rowData = formData as any[]
            })
          )
        })
      )

    })

  }

}

@NgModule({
  declarations: [CrudFormComponent],
  imports: [
    HushaGridModule
  ],
  exports: [CrudFormComponent]
})
export class CrudFormModule {

}
