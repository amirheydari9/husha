import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {GridActionsComponent, GridActionsModule} from "../grid-actions/grid-actions.component";
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {
  ColDef,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  IGetRowsParams,
  MenuItemDef,
  RowClickedEvent
} from "ag-grid-community";
import {BaseInfoService} from "../../api/base-info.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {ACCESS_FORM_ACTION_TYPE, FORM_KIND} from "../../constants/enums";
import {FetchAllDataPayloadDTO, HushaGridUtilService} from "../../utils/husha-grid-util.service";
import {AG_GRID_LOCALE_FA} from "../../constants/ag-grid-locale-fa";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";
import {Router} from "@angular/router";
import {DialogManagementService} from "../../utils/dialog-management.service";
import {AttachmentListDialogComponent} from "../dialog/attachment-list-dialog/attachment-list-dialog.component";
import {AdvanceSearchDialogComponent} from "../dialog/advance-search-dialog/advance-search-dialog.component";
import {CommonModule} from "@angular/common";
import {criteriaInterface} from "../../models/DTOs/fetch-all-form-data.DTO";
import {ExportExcelDialogComponent} from "../dialog/export-excel-dialog/export-excel-dialog.component";
import {StorageService} from 'src/app/utils/storage.service';
import {firstHistoryMultiLevelGrid, multiLevelGridInfo} from 'src/app/constants/keys';
import 'ag-grid-enterprise'
import {FetchFormDataByIdDTO} from "../../models/DTOs/fetch-form-data-by-id.DTO";
import {SignatureDialogComponent} from "../dialog/signature-dialog/signature-dialog.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info-grid',
  templateUrl: './base-info-grid.component.html'
})
export class BaseInfoGridComponent implements OnInit, AfterViewInit {

  subscription: Subscription[] = []

  criteria: criteriaInterface[] = null
  criteriaMetaData: any[] = null

  gridApi: GridApi
  defaultPageSize = 5
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, flex: 1, resizable: true, minWidth: 150
    },
    // getContextMenuItems: this.getContextMenuItems,
    rowModelType: 'infinite',
    enableRtl: true,
    rowSelection: 'single',
    cacheBlockSize: this.defaultPageSize,
    paginationPageSize: this.defaultPageSize,
    maxBlocksInCache: 1,
    // paginationAutoPageSize:true,
    enableRangeSelection: true,
    pagination: true,
    paginationPageSizeSelector: [5, 50, 100, 200],
    localeText: AG_GRID_LOCALE_FA,
    overlayNoRowsTemplate: 'رکوردی جهت نمایش یافت نشد',
    domLayout: 'autoHeight',
    multiSortKey: 'ctrl',
    // alwaysShowHorizontalScroll:false
  }
  accessFormActions: ACCESS_FORM_ACTION_TYPE[] = []
  contextMenuActions: ACCESS_FORM_ACTION_TYPE[] = null

  @Input() class: string
  @Input() form: IFetchFormRes
  @Input() masterId: number
  @Input() fetchSummary: boolean = false

  @ViewChild('gridActions') gridActions: GridActionsComponent
  @ViewChild('gridContainer', {read: ViewContainerRef}) gridContainer: ViewContainerRef

  gridHistory;
  parentId: number

  @Output() onRowDoubleClicked: EventEmitter<any> = new EventEmitter<any>()
  @Output() onRowClicked: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private cdr: ChangeDetectorRef,
    private hushaGridUtilService: HushaGridUtilService,
    private router: Router,
    private dialogManagementService: DialogManagementService,
    private storageService: StorageService,
    private renderer: Renderer2
  ) {
  }

  async setDataSourceAsync(): Promise<void> {
    return new Promise(((resolve, reject) => {
      const dataSource = {
        getRows: async (params: IGetRowsParams) => {
          const payload = new FetchAllDataPayloadDTO(
            this.form,
            this.parentId,
            this.masterId,
            this.gridApi.paginationGetCurrentPage(),
            this.gridApi.paginationGetPageSize(),
            this.hushaGridUtilService.handleSortParam(params.sortModel),
            this.criteria ?? null,
            null,
            this.fetchSummary ? 'id,code,title' : null
          );
          try {
            const formData = await this.hushaGridUtilService.handleFetchData(this.fetchSummary, payload).toPromise();
            const paginationInfo = formData.shift();
            const rowData = this.hushaGridUtilService.handleCreateRowData(formData, this.form)
            params.successCallback(rowData, paginationInfo['paginationTotalElements']);
            resolve()
          } catch (error) {
            params.failCallback();
            reject()
          }
        },
      };
      this.gridApi.setDatasource(dataSource);
    }))
  }

  async handleCreateDynamicGrid(gridConfig?: any) {
    //TODO لاگ برای unsubscribe کردن
    // این که هر سری داری گرید رو میسازی selected رو باید خالی باشه
    this.gridContainer.clear()
    const compRef = this.gridContainer.createComponent(AgGridAngular)
    this.renderer.addClass(compRef.location.nativeElement, 'ag-theme-alpine')
    this.columnDefs = this.hushaGridUtilService.handleCreateColumnDefs(this.form, this.fetchSummary)
    compRef.setInput('gridOptions', this.gridOptions)
    compRef.setInput('columnDefs', this.columnDefs)
    this.cdr.detectChanges()
    await new Promise<void>(resolve => {
      this.subscription.push(
        compRef.instance.gridReady.subscribe(event => {
          this.gridApi = event.api;
          resolve();
        })
      )
    });
    if (gridConfig) {
      this.gridApi.applyColumnState({
        state: gridConfig.sort,
        defaultState: {sort: null}
      })
      this.gridApi.paginationGoToPage(gridConfig.page)
      this.gridApi.paginationSetPageSize(gridConfig.pageSize)
    }
    if (this.contextMenuActions) {
      this.gridApi.setGridOption('getContextMenuItems', this.getContextMenuItems)
    }
    await this.setDataSourceAsync();
    this.subscription.push(
      compRef.instance.rowClicked.subscribe(event => this.handleRowClicked(event))
    )
    this.subscription.push(
      compRef.instance.rowDoubleClicked.subscribe(event => this.handleRowDbClicked(event))
    )
    //TODO test
    this.subscription.push(
      compRef.instance.paginationChanged.subscribe(event => {
        // this.gridApi.setNodesSelected({nodes: this.gridApi.getSelectedNodes(), newValue: false})
      })
    )
  }

  async ngAfterViewInit(): Promise<void> {
    this.storageService.removeSessionStorage(firstHistoryMultiLevelGrid)
    this.storageService.removeSessionStorage(multiLevelGridInfo)
    await this.handleCreateDynamicGrid()
  }

  async ngOnInit(): Promise<void> {
    const {actions, contextMenu} = await this.hushaGridUtilService.handleGridAccessActions(this.form, this.fetchSummary)
    this.accessFormActions = actions
    this.contextMenuActions = contextMenu
    this.gridApi?.setGridOption('getContextMenuItems', this.getContextMenuItems)
  }

  async handleRowDbClicked($event: any) {
    if (this.form.formKind.id === FORM_KIND.MULTI_LEVEL) {
      await this.handleMultiLevelGid(this.selectedRow)
    } else if (this.form.formKind.id === FORM_KIND.MASTER) {
      this.onRowDoubleClicked.emit(this.selectedRow?.id)
    }
  }

  handleRowClicked($event: RowClickedEvent<any>) {
    this.onRowClicked.emit(this.selectedRow)
  }

  async handleMultiLevelGid(selectedRow: any) {
    try {
      this.parentId = selectedRow.id
      this.gridHistory = selectedRow;
      const sessionGetData = this.storageService.getSessionStorage(multiLevelGridInfo) ?? []
      if (!sessionGetData.length) {
        this.storageService.setSessionStorage(firstHistoryMultiLevelGrid, {
          selectedChildId: selectedRow.id,
          page: this.gridApi.paginationGetCurrentPage(),
          pageSize: this.gridApi.paginationGetPageSize(),
          sort: this.hushaGridUtilService.handleCreateSortModel(this.gridApi),
          metaCriteria: this.criteriaMetaData,
        })
      }
      sessionGetData.push({
        historyId: selectedRow.id,
        originalPage: this.gridApi.paginationGetCurrentPage(),
        originalPageSize: this.gridApi.paginationGetPageSize(),
        originalSort: this.hushaGridUtilService.handleCreateSortModel(this.gridApi),
        originalMetaCriteria: this.criteriaMetaData,
      })
      this.handleResetCriteria()
      this.gridApi.setNodesSelected({nodes: this.gridApi.getSelectedNodes(), newValue: false})
      await this.handleCreateDynamicGrid()
      this.storageService.setSessionStorage(multiLevelGridInfo, sessionGetData)
    } catch (e) {
      console.log(e)
    }
  }

  async handleClickHistory(item: any) {
    this.parentId = item ? item.id : null
    let currentRow;
    if (this.parentId) {
      const sessionData = this.storageService.getSessionStorage(multiLevelGridInfo)
      currentRow = sessionData.find(row => row.historyId == item.id)
    } else {
      currentRow = this.storageService.getSessionStorage(firstHistoryMultiLevelGrid)
      this.storageService.removeSessionStorage(firstHistoryMultiLevelGrid)
      this.storageService.removeSessionStorage(multiLevelGridInfo)
    }
    this.handleCreateCriteria(currentRow.metaCriteria)
    await this.handleCreateDynamicGrid(currentRow)
    this.gridApi.paginationGoToPage(currentRow.page)
    setTimeout(() => {
      this.gridApi.forEachNode(node => {
        if (node.data?.id === currentRow.selectedChildId) node.setSelected(true)
      })
    }, 1000)
  }

  get selectedRow() {
    if (!this.gridApi?.isDestroyed()) {
      return this.gridApi?.getSelectedRows()[0]
    }
    return null
  }

  async handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    if ($event === ACCESS_FORM_ACTION_TYPE.ADD || $event === ACCESS_FORM_ACTION_TYPE.IMPORT) {
      this.hushaGridUtilService.handleRedirectActions($event, this.form, this.masterId)
    }
      // else if ($event === ACCESS_FORM_ACTION_TYPE.UPDATE) {
      //   this.hushaGridUtilService.handleRedirectActions($event, this.form, this.masterId, this.selectedRow)
      // }
      // else if ($event === ACCESS_FORM_ACTION_TYPE.DELETE) {
      //   this.handleDelete()
      // }
      // else if ($event === ACCESS_FORM_ACTION_TYPE.ATTACHMENTS) {
      //   this.handleAttachment()
    // }
    else if ($event === ACCESS_FORM_ACTION_TYPE.ADVANCE_SEARCH) {
      await this.handleAdvanceSearch()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.RESET_ADVANCE_SEARCH) {
      await this.handleResetAdvanceSearch()
    } else if ($event === ACCESS_FORM_ACTION_TYPE.EXPORT) {
      this.handleExport()
    }
    // else if ($event === ACCESS_FORM_ACTION_TYPE.SIGN) {
    //   this.handleSign()
    // }
  }

  handleDelete(id: number) {
    //TODO تست حذف در حالت مستر دیتیل
    //TODO چک کال شدن سرویس
    this.subscription.push(
      this.baseInfoService.deleteFormData(this.hushaGridUtilService.handleCreatePayloadForDeleteRow(
        this.form,
        // this.selectedRow?.id,
        id,
        this.masterId
      )).subscribe(async data => {
        // this.gridApi.applyServerSideTransaction({remove:[this.selectedRow.data]})
        // this.gridApi.paginationGoToPage(this.gridApi.paginationGetCurrentPage())
        const gridConfig = {
          page: this.gridApi.paginationGetCurrentPage(),
          pageSize: this.gridApi.paginationGetPageSize(),
          sort: this.hushaGridUtilService.handleCreateSortModel(this.gridApi)
        }
        await this.handleCreateDynamicGrid(gridConfig)
        this.gridApi.paginationGoToPage(gridConfig.page)
      })
    )
  }

  handleAttachment(id: number) {
    this.dialogManagementService.openDialog(AttachmentListDialogComponent, {
      data: {
        form: this.form,
        // ownId: this.selectedRow?.id
        ownId: id
      },
    })
  }

  async handleAdvanceSearch() {
    this.dialogManagementService.openDialog(AdvanceSearchDialogComponent, {
      data: {form: this.form, colDefs: this.gridApi.getColumnDefs(), criteria: this.criteriaMetaData},
    }).subscribe(async data => {
      if (data) {
        this.gridActions.handleResetCriteria()
        this.handleCreateCriteria(data)
        await this.handleCreateDynamicGrid()
      }
    })
  }

  async handleResetAdvanceSearch() {
    this.handleResetCriteria()
    await this.handleCreateDynamicGrid()
  }

  handleExport() {
    const rowData = []
    this.gridApi.forEachNode(row => rowData.push(row.data))
    const source = {
      cols: this.gridApi.getColumnDefs(),
      rowData,
      form: this.form,
      parentId: this.parentId,
      masterId: this.masterId,
      criteria: this.criteria
    }
    this.dialogManagementService.openDialog(ExportExcelDialogComponent, {
      data: {source},
    })
  }

  async handleAddCriteria(criteria: any) {
    this.criteria = [criteria].map(cr => ({
      key: cr.key,
      operation: cr.operation,
      value: cr.value,
      valueType: cr.valueType,
    }))
    await this.handleCreateDynamicGrid()
    this.criteriaMetaData = null
  }


  getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
    const result: (string | MenuItemDef)[] = []
    if (this.contextMenuActions.indexOf(ACCESS_FORM_ACTION_TYPE.DELETE) > -1) {
      result.push({
        name: 'حذف ',
        action: () => this.handleDelete(params.node.data.id)
      })
    }
    if (this.contextMenuActions.indexOf(ACCESS_FORM_ACTION_TYPE.UPDATE) > -1) {
      result.push({
        name: 'ویرایش ',
        action: () => this.hushaGridUtilService.handleRedirectActions(ACCESS_FORM_ACTION_TYPE.UPDATE, this.form, this.masterId, params.node.data)
      })
    }
    if (this.contextMenuActions.indexOf(ACCESS_FORM_ACTION_TYPE.SIGN) > -1) {
      result.push({
        name: 'تایید سند و امضاها ',
        action: () => this.handleSign(params.node.data.id)
      })
    }
    if (this.contextMenuActions.indexOf(ACCESS_FORM_ACTION_TYPE.ATTACHMENTS) > -1) {
      result.push({
        name: 'لیست ضمیمه ها',
        action: () => this.handleAttachment(params.node.data.id)
      })
    }
    return result
  }

  private handleSign(id: number) {
    const payload = new FetchFormDataByIdDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.serviceTypeId,
      this.form.id,
      this.form.formKind.id,
      // this.selectedRow.id,
      id,
      this.form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
      this.form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
      this.form.formKind.id === FORM_KIND.DETAIL ? this.masterId : null,
      this.form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.serviceTypeId : null,
    )
    this.subscription.push(
      this.baseInfoService.fetchFormData(payload).subscribe(data => {
        this.dialogManagementService.openDialog(SignatureDialogComponent, {
          data: {row: data, form: this.form}
        })
      })
    )
  }

  handleCreateCriteria(metaCriteria) {
    if (metaCriteria && metaCriteria.length) {
      this.criteriaMetaData = metaCriteria;
      this.criteria = metaCriteria.map(cr => ({
        key: cr.key,
        operation: cr.operation,
        value: cr.value,
        valueType: cr.valueType,
      }))
    } else {
      this.criteriaMetaData = null
      this.criteria = null
    }
  }

  handleResetCriteria() {
    this.criteria = null
    this.criteriaMetaData = null
    this.gridActions.handleResetCriteria()
  }

}

@NgModule({
  declarations: [BaseInfoGridComponent],
  imports: [
    GridActionsModule,
    AgGridModule,
    CustomCardModule,
    CommonModule,
  ],
  exports: [BaseInfoGridComponent]
})
export class BaseInfoGridModule {

}
