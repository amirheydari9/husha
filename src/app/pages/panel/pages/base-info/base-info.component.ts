import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FORM_KIND} from "../../../../constants/enums";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../../../constants/keys";
import {IGetServicesRes} from "../../../../models/interface/get-services-res.interface";
import {ColDef} from "ag-grid-community";
import {StorageService} from "../../../../utils/storage.service";
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchFormDTO} from "../../../../models/DTOs/fetch-form.DTO";
import {FetchFormDataDTO} from "../../../../models/DTOs/fetch-form-data.DTO";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormDataRes} from "../../../../models/interface/fetch-form-data-res.interface";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

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
      this.resetForm()
      const form = this.activatedRoute.snapshot.data['data'];
      this.formKind = form.formKind.id
      this.subscription.push(
        this.baseInfoService.fetchFormData(this.handleCreatePayload(form)).subscribe(formData => {
          const {colDefs, rowData} = this.createGrid(form, formData)
          this.columnDefs = colDefs
          this.rowData = rowData
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
                const {colDefs, rowData} = this.createGrid(form, formData)
                this.columnDefs = colDefs
                this.rowData = rowData

              } else if (this.formKind === FORM_KIND.MASTER) {
                if (this.showDetailGrid) {
                  this.showDetailGrid = false
                  this.detailColumnDefs = []
                  this.detailRowData = []
                }
                const {colDefs, rowData} = this.createGrid(form, formData)
                this.detailColumnDefs = colDefs
                this.detailRowData = rowData
                this.showDetailGrid = true
              }
            })
          )
        })
      )
    }
  }

  createGrid(form: IFetchFormRes, rowData: IFetchFormDataRes[]) {
    const colDefs: ColDef[] = []
    form.fields.forEach(item => {
      if (item.isActive) {
        const col: ColDef = {field: item.name}
        colDefs.push(col)
      }
    })
    for (var i = 0; i < rowData.length; i++) {
      for (var prop in rowData[i]) {
        if (typeof rowData[i][prop] === 'object') {
          rowData[i][prop] = rowData[i][prop]?.id;
        }
      }
    }
    return {colDefs, rowData}
  }

  resetForm() {
    this.columnDefs = [];
    this.rowData = [];
    this.formKind = null
    this.showDetailGrid = false
    this.detailColumnDefs = []
    this.detailRowData = []
  }

}
