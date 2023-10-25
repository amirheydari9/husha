import {ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {GridActionsComponent, GridActionsModule} from "../grid-actions/grid-actions.component";
import {AgGridModule} from "ag-grid-angular";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {
  ColDef, ColumnApi, GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  SortChangedEvent
} from "ag-grid-community";
import {BaseInfoService} from "../../api/base-info.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {FORM_KIND} from "../../constants/enums";
import {FetchAllDataPayloadDTO, HushaGridUtilService} from "../../utils/husha-grid-util.service";
import {AG_GRID_LOCALE_FA} from "../../constants/ag-grid-locale-fa";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";
import {Router} from "@angular/router";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info-grid',
  templateUrl: './base-info-grid.component.html'
})
export class BaseInfoGridComponent implements OnInit {

  subscription: Subscription[] = []

  gridApi: GridApi
  colApi: ColumnApi
  defaultPageSize = 5
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, flex: 1, resizable: true
    },
    rowModelType: 'infinite',
    enableRtl: true,
    rowSelection: 'single',
    cacheBlockSize: this.defaultPageSize,
    paginationPageSize: this.defaultPageSize,
    // paginationAutoPageSize:true,
    enableRangeSelection: true,
    pagination: true,
    localeText: AG_GRID_LOCALE_FA,
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد',
    domLayout: 'autoHeight',
    // alwaysShowHorizontalScroll:false
  }

  @Input() class: string
  @Input() form: IFetchFormRes
  @Input() masterId: number
  @Input() fetchSummary: boolean = false
  @Input() showCrudActions: boolean = true

  @ViewChild('gridActions') gridActions: GridActionsComponent

  gridHistory = []
  parentId: number
  selectedRow: any

  @Output() onRowDoubleClicked: EventEmitter<any> = new EventEmitter<any>()
  @Output() onRowClicked: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private cdr: ChangeDetectorRef,
    private hushaGridUtilService: HushaGridUtilService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

  }

  handleGirdReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
    this.colApi = $event.columnApi;
    this.gridApi.setDatasource(this.dataSource)
  }

  dataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      const payload = new FetchAllDataPayloadDTO(
        this.form,
        this.parentId,
        this.masterId,
        this.gridApi.paginationGetCurrentPage(),
        this.gridApi.paginationGetPageSize(),
        this.hushaGridUtilService.handleSortParam(params.sortModel)
      )
      this.hushaGridUtilService.handleFetchData(this.fetchSummary, payload).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.hushaGridUtilService.createGrid(formData, this.form, this.fetchSummary)
        this.columnDefs = colDefs
        //TODO وقتی دیتا نداریم باید عیارت دیتا یافت نشد نمایش داده شود
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }


  handleRowDbClicked($event: any) {
    this.selectedRow = null
    const selectedRow = $event.data
    if (this.form.formKind.id === FORM_KIND.MULTI_LEVEL) {
      this.handleMultiLevelGid(selectedRow)
    } else if (this.form.formKind.id === FORM_KIND.MASTER) {
      this.onRowDoubleClicked.emit(selectedRow.id)
    }
  }

  handleRowClicked($event: RowClickedEvent<any>) {
    this.selectedRow = $event.data
    this.onRowClicked.emit(this.selectedRow)
  }

  handleMultiLevelGid(selectedRow: any) {
    this.parentId = selectedRow.id
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
        this.masterId
      )).subscribe(data => {
        this.gridApi.setDatasource(this.dataSource)
      })
    )
  }

  handleUpdate($event: any) {
    this.router.navigate([`/form/${this.form.id}/update/${$event.id}`], {
      queryParams: {
        masterId: this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null
      }
    })
  }

  handleCreate() {
    this.router.navigate([`/form/${this.form.id}/create`], {
      queryParams: {
        masterId: this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null
      }
    })
  }

  handleSortChange($event: SortChangedEvent<any>) {
    const columnWithSort = this.colApi.getColumnState().find(col => col.sort !== null);
    if (columnWithSort) {
      console.log("Column that is sorted right now is " + columnWithSort.colId);
      console.log("The sort order right now is " + columnWithSort.sort);  // prints "asc" or "desc"
    } else {

    }
  }
}

@NgModule({
  declarations: [BaseInfoGridComponent],
  imports: [
    GridActionsModule,
    AgGridModule,
    CustomCardModule
  ],
  exports: [BaseInfoGridComponent]
})
export class FormGridModule {

}
