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
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";

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
              this.columnDefs = this.createGrid(form)
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
    if (this.formKind === FORM_KIND.MULTI_LEVEL || this.formKind === FORM_KIND.MASTER) {
      this.subscription.push(
        this.baseInfoService.fetchForm(new FetchFormDTO(this.activatedRoute.snapshot.params['id'])).subscribe(form => {
          this.subscription.push(
            this.baseInfoService.fetchFormData(this.handleCreatePayload(form, $event.id)).subscribe(formData => {
              if (this.formKind === FORM_KIND.MULTI_LEVEL) {
                this.columnDefs = []
                this.rowData = []
                this.columnDefs = this.createGrid(form)
                this.rowData = formData as any[]

              } else if (this.formKind === FORM_KIND.MASTER) {
                if (this.showDetailGrid) {
                  this.showDetailGrid = false
                  this.detailColumnDefs = []
                  this.detailRowData = []
                }
                this.detailColumnDefs = this.createGrid(form)
                this.detailRowData = formData as any[]
                this.showDetailGrid = true
              }
            })
          )
        })
      )
    }
  }

  createGrid(form: IFetchFormRes): ColDef[] {
    const colDefs: ColDef[] = []
    form.fields.forEach(item => {
      if (item.isActive) {
        const col: ColDef = {field: item.name}
        colDefs.push(col)
      }
    })
    return colDefs
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
