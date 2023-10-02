import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Subscription} from "rxjs";
import {FORM_KIND, VIEW_TYPE} from "../../../../constants/enums";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../../../constants/keys";
import {IGetServicesRes} from "../../../../models/interface/get-services-res.interface";
import {ColDef, GridOptions, IDatasource, IGetRowsParams} from "ag-grid-community";
import {StorageService} from "../../../../utils/storage.service";
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchFormDataDTO} from "../../../../models/DTOs/fetch-form-data.DTO";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormDataRes} from "../../../../models/interface/fetch-form-data-res.interface";
import {AgGridAngular} from "ag-grid-angular";
import {
  MultiLevelGridHistoryComponent
} from "../../../../components/multi-level-grid-history/multi-level-grid-history.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit, AfterViewInit {

  subscription: Subscription[] = []
  form: IFetchFormRes
  formKind: FORM_KIND

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey)
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey)

  // columnDefs: ColDef[] = []
  // rowData: any[] = []

  showDetailGrid: boolean = false
  detailColumnDefs: ColDef[] = []
  detailRowData: any[] = []

  private gridApi: any
  private gridColumnApi: any
  defaultPageSize = 2
  rowData = []
  columnDefs: ColDef[] = []

  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    rowModelType: 'infinite'
  }

  private detailGridApi: any
  private detailGridColumnApi: any
  extraId: number

  @ViewChild('grid') grid!: AgGridAngular;
  @ViewChild('detailGrid') detailGrid!: AgGridAngular;
  @ViewChild('multiLevelGridHistory') multiLevelGridHistory: MultiLevelGridHistoryComponent

  multilevelHistory = []

  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.resetForm()
      this.form = this.activatedRoute.snapshot.data['data'];
      this.formKind = this.form.formKind.id
      this.gridApi = this.grid.api;
      // this.gridColumnApi = this.agGrid.columnApi
      this.gridApi.setDatasource(this.dataSource)
    })
  }

  ngOnInit(): void {

  }

  dataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      let sort = undefined;
      let colId = undefined;
      if (params.sortModel[0]) {
        sort = params.sortModel[0].sort
        colId = params.sortModel[0].colId
      }
      this.baseInfoService.fetchFormData(this.handleCreatePayload(this.extraId ?? null, this.gridApi.paginationGetCurrentPage(), this.gridApi.paginationGetPageSize())).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.createGrid(formData)
        this.columnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }

  dataSourceDetail: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      let sort = undefined;
      let colId = undefined;
      if (params.sortModel[0]) {
        sort = params.sortModel[0].sort
        colId = params.sortModel[0].colId
      }
      this.baseInfoService.fetchFormData(this.handleCreatePayload(this.extraId, this.detailGridApi.paginationGetCurrentPage(), this.detailGridApi.paginationGetPageSize())).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.createGrid(formData)
        this.detailColumnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }


  handleCreatePayload(id?: number, page: number = 0, size: number = this.defaultPageSize) {
    return new FetchFormDataDTO(
      this.selectedCustomer.id,
      this.form.id,
      this.form.formKind.id,
      // this.selectedService.id,
      101,
      // this.selectedUnit.id,
      71,
      this.selectedPeriod.id,
      page,
      size,
      // this.selectedService?.serviceType.id,
      this.form.formKind.id === FORM_KIND.FLAT || this.form.formKind.id === FORM_KIND.MULTI_LEVEL ? 24 : null,
      this.form.formKind.id === FORM_KIND.MULTI_LEVEL && id ? id : null,
      this.form.formKind.id === FORM_KIND.DETAIL && id ? id : null
    )
  }

  handleRowClicked($event: any) {
    // if (this.formKind === FORM_KIND.MULTI_LEVEL || this.formKind === FORM_KIND.MASTER) {

    const selectedRow = $event.data
    this.extraId = selectedRow.id

    if (this.formKind === FORM_KIND.MULTI_LEVEL) {
      this.gridApi.setDatasource(this.dataSource)
      // this.columnDefs = []
      // this.rowData = []
      // const {colDefs, rowData} = this.createGrid(formData)
      // this.columnDefs = colDefs
      // this.rowData = rowData
      // if(this.multilevelHistory.indexOf(selectedRow) === -1)

      if (!this.multilevelHistory.length) this.multilevelHistory.push(selectedRow)
      this.cdr.detectChanges()
      const index = this.multilevelHistory.findIndex(item => item.id === selectedRow.id)
      if (index < 0) {
        this.multilevelHistory.push(selectedRow)
        this.cdr.detectChanges()
        this.multiLevelGridHistory.activeHistory(this.multilevelHistory.length - 1)
      } else {
        this.multiLevelGridHistory.activeHistory(index)
      }
    } else if (this.formKind === FORM_KIND.MASTER) {
      if (this.showDetailGrid) {
        this.showDetailGrid = false
        this.detailColumnDefs = []
        this.detailRowData = []
      }
      this.showDetailGrid = true
      this.cdr.detectChanges()
      this.detailGridApi = this.detailGrid.api
      this.detailGridColumnApi = this.detailGrid.columnApi
      this.detailGridApi.setDatasource(this.dataSourceDetail)
    }

    // }
  }

  createGrid(rowData: IFetchFormDataRes[]) {
    const colDefs: ColDef[] = []
    this.form.fields.forEach(item => {
      if (item.isActive && (item.viewType == VIEW_TYPE.SHOW_IN_GRID || item.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)) {
        const col: ColDef = {field: item.name, headerName: item.caption}
        colDefs.push(col)
      }
    })
    for (let i = 0; i < rowData.length; i++) {
      for (let prop in rowData[i]) {
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

    this.gridApi = undefined
    this.gridColumnApi = undefined

    this.detailGridApi = undefined
    this.detailGridColumnApi = undefined

    this.extraId = null

    this.multilevelHistory = []
  }

  handleClickHistory(item: any) {
    this.extraId = item.id
    this.gridApi.setDatasource(this.dataSource)
  }

}
