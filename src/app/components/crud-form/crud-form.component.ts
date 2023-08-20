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
import {FORM_KIND} from "../../constants/enums";
import {NgIf} from "@angular/common";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent implements OnInit {

  subscription: Subscription[] = []
  formKind: FORM_KIND

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey)
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey)

  columnDefs: ColDef[] = []
  rowData: any[] = []

  showDetailGrid: boolean = false
  detailColumnDefs: ColDef[] = []
  detailRowData: any[] = []

  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {

      this.columnDefs = [];
      this.rowData = [];
      this.formKind = null
      this.showDetailGrid = false
      this.detailColumnDefs = []
      this.detailRowData = []

      this.subscription.push(
        this.baseInfoService.fetchForm(new FetchFormDTO(params['id'])).subscribe(form => {
          this.formKind = form.formKind.id
          this.subscription.push(
            this.baseInfoService.fetchFormData(this.handleCreatePayload(form)).subscribe(formData => {
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

  handleCreatePayload(form, id?: number) {
    return new FetchFormDataDTO(
      this.selectedCustomer.id,
      form.id,
      form.formKind.id,
      // this.selectedService.id,
      101,
      // this.selectedUnit.id,
      71,
      this.selectedPeriod.id,
      1,
      2,
      // this.selectedService?.serviceType.id,
      form.formKind.id === FORM_KIND.FLAT || form.formKind.id === FORM_KIND.MULTI_LEVEL ? 24 : null,
      form.formKind.id === FORM_KIND.MULTI_LEVEL && id ? id : null,
      form.formKind.id === FORM_KIND.DETAIL && id ? id : null
    )
  }

  handleRowClicked($event: any) {

    this.showDetailGrid = false
    this.detailColumnDefs = []
    this.detailRowData = []

    this.subscription.push(
      this.baseInfoService.fetchForm(new FetchFormDTO(this.activatedRoute.snapshot.params['id'])).subscribe(form => {
        this.subscription.push(
          this.baseInfoService.fetchFormData(this.handleCreatePayload(form, $event.id)).subscribe(formData => {
            // تا چه سطحی مالتی لوب داریم ممکننه یک دیتیل وقتی روی سطرش کلیک می کنیم یک دفعه مالتی لول بشه
            // یعنی اگه مالتی لوله تا تهش مالتی لوله ؟
            if (this.formKind === FORM_KIND.MULTI_LEVEL) {
              const colDefs: ColDef[] = []
              form.fields.forEach(item => {
                const col: ColDef = {field: item.name}
                colDefs.push(col)
              })
              this.columnDefs = colDefs
              this.rowData = formData as any[]

            } else if (this.formKind === FORM_KIND.MASTER) {
              const colDefs: ColDef[] = []
              form.fields.forEach(item => {
                const col: ColDef = {field: item.name}
                colDefs.push(col)
              })
              this.detailColumnDefs = colDefs
              this.detailRowData = formData as any[]
              this.showDetailGrid = true
            }
          })
        )
      })
    )

  }

}

@NgModule({
  declarations: [CrudFormComponent],
  imports: [
    HushaGridModule,
    NgIf
  ],
  exports: [CrudFormComponent]
})
export class CrudFormModule {

}
