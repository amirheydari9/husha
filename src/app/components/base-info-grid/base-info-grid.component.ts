import {ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {GridActionsComponent, GridActionsModule} from "../grid-actions/grid-actions.component";
import {AgGridModule} from "ag-grid-angular";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {ColDef, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams} from "ag-grid-community";
import {BaseInfoService} from "../../api/base-info.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {FORM_KIND} from "../../constants/enums";
import {HushaGridUtilService} from "../../utils/husha-grid-util.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info-grid',
  templateUrl: './base-info-grid.component.html'
})
export class BaseInfoGridComponent implements OnInit {

  subscription: Subscription[] = []

  gridApi: any
  defaultPageSize = 2
  rowData = []
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, flex: 1
    },
    rowModelType: 'infinite',
    enableRtl: true,
    rowSelection: 'single',
    cacheBlockSize: this.defaultPageSize,
    paginationPageSize: this.defaultPageSize,
    // paginationAutoPageSize:true,
    enableRangeSelection: true,
    pagination: true,
  }

  @Input() form: IFetchFormRes
  @Input() masterId: number

  @ViewChild('gridActions') gridActions: GridActionsComponent

  gridHistory = []
  parentId: number
  selectedRow: any

  @Output() onDbClick: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private cdr: ChangeDetectorRef,
    private hushaGridUtilService: HushaGridUtilService
  ) {
  }

  ngOnInit(): void {

  }

  handleGirdReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
    this.gridApi.setDatasource(this.dataSource)
  }

  dataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      this.baseInfoService.fetchAllFormData(this.hushaGridUtilService.handleCreatePayloadForFetchAllData(
        this.form,
        this.parentId,
        this.masterId,
        this.gridApi.paginationGetCurrentPage(),
        this.gridApi.paginationGetPageSize(),
        this.hushaGridUtilService.handleSortParam(params.sortModel)
      )).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.hushaGridUtilService.createGrid(formData, this.form)
        this.columnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }


  handleRowDbClicked($event: any) {
    this.selectedRow = null
    const selectedRow = $event.data
    this.parentId = selectedRow.id
    if (this.form.formKind.id === FORM_KIND.MULTI_LEVEL) {
      this.handleMultiLevelGid(selectedRow)
    } else if (this.form.formKind.id === FORM_KIND.MASTER) {
      this.onDbClick.emit($event.id)
    }
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

  handleClickHistory(item: any) {
    this.parentId = item ? item.id : null
    this.gridApi.setDatasource(this.dataSource)
  }

  handleDelete($event: any) {
    //TODO تست حذف در حالت مستر دیتیل
    this.subscription.push(
      this.baseInfoService.deleteFormData(this.hushaGridUtilService.handleCreatePayloadForDeleteRow(
        this.form,
        $event.id,
        this.masterId,
      )).subscribe(data => {
        this.gridApi.setDatasource(this.dataSource)
      })
    )
  }
}

@NgModule({
  declarations: [BaseInfoGridComponent],
  imports: [
    GridActionsModule,
    AgGridModule
  ],
  exports: [BaseInfoGridComponent]
})
export class FormGridModule {

}
