import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {FORM_KIND, VIEW_TYPE} from "../../../../constants/enums";
import {ColDef, GridOptions, IDatasource, IGetRowsParams} from "ag-grid-community";
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchAllFormDataDTO} from "../../../../models/DTOs/fetch-all-form-data.DTO";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormDataRes} from "../../../../models/interface/fetch-form-data-res.interface";
import {AgGridAngular} from "ag-grid-angular";
import {GridActionsComponent} from "../../../../components/grid-actions/grid-actions.component";
import {DeleteFormDataDTO} from "../../../../models/DTOs/delete-form-data.DTO";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit, AfterViewInit {

  subscription: Subscription[] = []
  form: IFetchFormRes

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
  selectedRow: any
  selectedDetailRow: any

  @ViewChild('grid') grid!: AgGridAngular;
  @ViewChild('detailGrid') detailGrid!: AgGridAngular;
  @ViewChild('gridActions') gridActions: GridActionsComponent
  @ViewChild('detailGridTemp', {read: TemplateRef}) detailGridTemp: TemplateRef<any>
  @ViewChild('detailGridContainer', {read: ViewContainerRef}) detailGridContainer: ViewContainerRef

  gridHistory = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
    private cdr: ChangeDetectorRef,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.resetForm()
      this.form = this.activatedRoute.snapshot.data['data'];
      this.cdr.detectChanges()
      this.gridApi = this.grid.api;
      // this.gridColumnApi = this.agGrid.columnApi
      this.gridApi.setDatasource(this.dataSource)
    })
  }

  ngOnInit(): void {

  }

  handleSortParam(sortModel: any[]) {
    let sort = null
    if (sortModel.length) {
      sort = sortModel.map(item => {
        const obj = {colId: item.colId, sort: item.sort}
        return Object.values(obj).join(':');
      }).join(',')
    }
    return sort
  }

  dataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      this.baseInfoService.fetchAllFormData(this.handleCreatePayload(
        this.extraId ?? null,
        this.gridApi.paginationGetCurrentPage(),
        this.gridApi.paginationGetPageSize(),
        this.handleSortParam(params.sortModel)
      )).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.createGrid(formData)
        this.columnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }

  detailDataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      this.baseInfoService.fetchAllFormData(this.handleCreatePayload(
        this.extraId,
        this.detailGridApi.paginationGetCurrentPage(),
        this.detailGridApi.paginationGetPageSize(),
        this.handleSortParam(params.sortModel)
      )).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.createGrid(formData)
        this.detailColumnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }


  handleCreatePayload(id?: number, page: number = 0, size: number = this.defaultPageSize, sort?: string) {
    return new FetchAllFormDataDTO(
      this.hushaCustomerUtilService.customer.id,
      this.form.id,
      this.form.formKind.id,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      this.form.formKind.id === FORM_KIND.FLAT || this.form.formKind.id === FORM_KIND.MULTI_LEVEL ? this.hushaCustomerUtilService.serviceTypeId : null,
      page,
      size,
      sort,
      this.form.formKind.id === FORM_KIND.MULTI_LEVEL && id ? id : null,
      this.form.formKind.id === FORM_KIND.DETAIL && id ? id : null,
    )
  }

  handleRowDbClicked($event: any) {
    const selectedRow = $event.data
    this.extraId = selectedRow.id
    if (this.form.formKind.id === FORM_KIND.MULTI_LEVEL) {
      this.handleMultiLevelGid(selectedRow)
    } else if (this.form.formKind.id === FORM_KIND.MASTER) {
      this.handleMasterGrid()
    }
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
        if (typeof rowData[i][prop] === 'object' && rowData[i][prop] !== null) {
          rowData[i][prop] = rowData[i][prop].id;
        }
      }
    }
    return {colDefs, rowData}
  }

  handleMultiLevelGid(selectedRow: any) {
    this.gridApi.setDatasource(this.dataSource)
    if (!this.gridHistory.length) this.gridHistory.push(selectedRow)
    this.cdr.detectChanges()
    const index = this.gridHistory.findIndex(item => item.id === selectedRow.id)
    if (index < 0) {
      this.gridHistory.push(selectedRow)
      this.cdr.detectChanges()
      this.gridActions.activeHistory(this.gridHistory.length - 1)
    } else {
      this.gridActions.activeHistory(index)
    }
  }

  handleMasterGrid() {
    this.detailGridContainer.clear()
    const template = this.detailGridTemp.createEmbeddedView(null)
    this.detailGridContainer.insert(template)
    this.cdr.detectChanges()
    this.detailGridApi = this.detailGrid.api
    this.detailGridColumnApi = this.detailGrid.columnApi
    this.detailGridApi.setDatasource(this.detailDataSource)
  }

  resetForm() {

    this.columnDefs = [];
    this.rowData = [];

    this.detailColumnDefs = []
    this.detailRowData = []
    this.detailGridContainer.clear()

    this.gridApi = undefined
    this.gridColumnApi = undefined

    this.detailGridApi = undefined
    this.detailGridColumnApi = undefined

    this.extraId = null

    this.gridHistory = []

    this.selectedRow = null
    this.selectedDetailRow = null
  }

  handleClickHistory(item: any) {
    this.extraId = item ? item.id : null
    this.gridApi.setDatasource(this.dataSource)
  }

  handleDelete($event: any) {
    const payload = new DeleteFormDataDTO(
      this.hushaCustomerUtilService.customer,
      this.hushaCustomerUtilService.serviceTypeId,
      this.form.id,
      this.form.formKind.id,
      +$event.id
    )
    this.subscription.push(
      this.baseInfoService.deleteFormData(payload).subscribe(data => {
        this.gridApi.setDatasource(this.dataSource)
      })
    )
  }
}
