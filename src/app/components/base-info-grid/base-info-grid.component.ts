import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {GridActionsComponent, GridActionsModule} from "../grid-actions/grid-actions.component";
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  SortChangedEvent
} from "ag-grid-community";
import {BaseInfoService} from "../../api/base-info.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {ACCESS_FORM_ACTION_TYPE, CRITERIA_OPERATION_TYPE, FORM_KIND} from "../../constants/enums";
import {FetchAllDataPayloadDTO, HushaGridUtilService} from "../../utils/husha-grid-util.service";
import {AG_GRID_LOCALE_FA} from "../../constants/ag-grid-locale-fa";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";
import {Router} from "@angular/router";
import {DialogManagementService} from "../../utils/dialog-management.service";
import {AttachmentListDialogComponent} from "../dialog/attachment-list-dialog/attachment-list-dialog.component";
import {AdvanceSearchDialogComponent} from "../dialog/advance-search-dialog/advance-search-dialog.component";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CustomInputTextModule} from "../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {criteriaInterface} from "../../models/DTOs/fetch-all-form-data.DTO";
import {ExportExcelDialogComponent} from "../dialog/export-excel-dialog/export-excel-dialog.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info-grid',
  templateUrl: './base-info-grid.component.html'
})
export class BaseInfoGridComponent implements OnInit, AfterViewInit {

  subscription: Subscription[] = []

  searchSummaryForm: FormGroup
  summaryCriteria: criteriaInterface[] = null

  gridApi: GridApi
  colApi: ColumnApi
  defaultPageSize = 5
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, flex: 1, resizable: true, minWidth: 150
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
  accessFormActions: ACCESS_FORM_ACTION_TYPE[] = []

  @Input() class: string
  @Input() form: IFetchFormRes
  @Input() masterId: number
  @Input() fetchSummary: boolean = false

  @ViewChild('gridActions') gridActions: GridActionsComponent
  @ViewChild('grid', {read: AgGridAngular}) grid: AgGridAngular

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
    private router: Router,
    private dialogManagementService: DialogManagementService,
    private fb: FormBuilder
  ) {
  }

  ngAfterViewInit(): void {
    this.gridApi = this.grid.api;
    this.colApi = this.grid.columnApi;
    this.gridApi.setDatasource(this.dataSource)
  }

  async ngOnInit(): Promise<void> {
    if (this.fetchSummary) {
      this.searchSummaryForm = this.fb.group({
        code: this.fb.control(null),
        title: this.fb.control(null),
      })
    }
    this.accessFormActions = await this.hushaGridUtilService.handleGridAccessActions(this.form, this.fetchSummary)
  }

  get code(): FormControl {
    return this.searchSummaryForm.controls['code'] as FormControl
  }

  get title(): FormControl {
    return this.searchSummaryForm.controls['title'] as FormControl
  }

  dataSource: IDatasource = {
    getRows: ((params: IGetRowsParams) => {
      const payload = new FetchAllDataPayloadDTO(
        this.form,
        this.parentId,
        this.masterId,
        this.gridApi.paginationGetCurrentPage(),
        this.gridApi.paginationGetPageSize(),
        this.hushaGridUtilService.handleSortParam(params.sortModel),
        this.fetchSummary ? this.summaryCriteria : null,
        null,
        this.fetchSummary ? 'id,code,title' : null
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

  handleSortChange($event: SortChangedEvent<any>) {
    const columnWithSort = this.colApi.getColumnState().find(col => col.sort !== null);
    if (columnWithSort) {
      console.log("Column that is sorted right now is " + columnWithSort.colId);
      console.log("The sort order right now is " + columnWithSort.sort);  // prints "asc" or "desc"
    } else {

    }
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    if ($event === ACCESS_FORM_ACTION_TYPE.ADD) {
      this.handleAdd()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.UPDATE) {
      this.handleUpdate()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.DELETE) {
      this.handleDelete()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.ATTACHMENTS) {
      this.handleAttachment()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.IMPORT) {
      this.handleImport()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.ADVANCE_SEARCH) {
      this.handleAdvanceSearch()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.EXPORT) {
      this.handleExport()
    }
  }

  handleAdd() {
    this.router.navigate([`/form/${this.form.id}/create`], {
      queryParams: {
        masterId: this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null
      }
    })
  }

  handleUpdate() {
    this.router.navigate([`/form/${this.form.id}/update/${this.selectedRow.id}`], {
      queryParams: {
        masterId: this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null
      }
    })
  }

  handleDelete() {
    //TODO تست حذف در حالت مستر دیتیل
    this.subscription.push(
      this.baseInfoService.deleteFormData(this.hushaGridUtilService.handleCreatePayloadForDeleteRow(
        this.form,
        this.selectedRow.id,
        this.masterId
      )).subscribe(data => {
        this.gridApi.setDatasource(this.dataSource)
      })
    )
  }

  handleAttachment() {
    this.dialogManagementService.openDialog(AttachmentListDialogComponent, {
      data: {form: this.form, ownId: this.selectedRow.id},
    })
  }

  handleImport() {
    this.router.navigate([`/form/${this.form.id}/import-excel`], {
      queryParams: {
        masterId: this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null
      }
    })
  }

  handleAdvanceSearch() {
    this.dialogManagementService.openDialog(AdvanceSearchDialogComponent, {
      data: {form: this.form},
    }).subscribe(data => {
      console.log(data)
    })
  }

  handleExport() {
    const data = []
    this.gridApi.forEachNode(row => data.push(row.data))
    const source = {
      cols: this.gridApi.getColumnDefs(),
      data,
      form: this.form,
      parentId: this.parentId,
      masterId: this.masterId,
    }
    this.dialogManagementService.openDialog(ExportExcelDialogComponent, {
      data: {source},
    })
  }

  handleSummarySearch() {
    this.summaryCriteria = []
    if (this.code.value) {
      this.summaryCriteria.push({key: 'code', operation: CRITERIA_OPERATION_TYPE.EQUAL, value: this.code.value},)
    }
    if (this.title.value) {
      this.summaryCriteria.push({key: 'title', operation: CRITERIA_OPERATION_TYPE.EQUAL, value: this.title.value},)
    }
    this.gridApi.setDatasource(this.dataSource)
  }
}

@NgModule({
  declarations: [BaseInfoGridComponent],
  imports: [
    GridActionsModule,
    AgGridModule,
    CustomCardModule,
    NgIf,
    ReactiveFormsModule,
    CustomInputTextModule,
    CustomButtonModule
  ],
  exports: [BaseInfoGridComponent]
})
export class BaseInfoGridModule {

}
