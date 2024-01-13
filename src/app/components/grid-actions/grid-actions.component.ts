import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {NgClass, NgFor, NgIf} from "@angular/common";
import {ACCESS_FORM_ACTION_TYPE, FORM_KIND} from "../../constants/enums";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {CriteriaBuilderComponent, CriteriaBuilderModule} from "../criteria-builder/criteria-builder.component";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {ColDef, GridOptions} from "ag-grid-community";
import {CustomGridComponent, CustomGridModule} from "../../ui-kits/custom-grid/custom-grid.component";
import {AgGridModule} from "ag-grid-angular";
import {StorageService} from 'src/app/utils/storage.service';
import {multiLevelGridInfo} from 'src/app/constants/keys';

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex align-items-center justify-content-between mb-3">
      <div class="flex-grow-1">
        <app-criteria-builder
          #criteriaBuilder
          [form]="form"
          [colDefs]="colDefs"
          [resetForm]="false"
          [icon]="'pi pi-search'"
          (onAddCriteria)="onAddCriteria.emit($event)"
        ></app-criteria-builder>
      </div>
      <app-custom-button
        *ngFor="let action of totalAccessFormActions"
        class="mr-1"
        type="button"
        [icon]="action.icon"
        [styleClass]="action.styleClass"
        [disabled]="handleDisableIcon(action.type)"
        [tooltip]="action.tooltip"
        (onClick)="handleClickAction(action.type)"
        [confirmationConfig]="handleConfirmationConfig(action.type)"
        (confirm)="handleClickAction(action.type)"
      ></app-custom-button>
    </div>
    <div class="mb-3" *ngIf="form?.formKind.id=== FORM_KIND.MULTI_LEVEL">
      <app-custom-grid
        #grid
        [columnDefs]="historyGridColDefs"
        (rowClicked)="handleClickGridRow($event.data, $event.rowIndex);"
        [gridOptions]="gridOptions"
        (onEnterKeyDown)="handleEnterKeyDownOnGrid($event)"
      ></app-custom-grid>
    </div>
  `,
  styles: [],
})
export class GridActionsComponent implements OnInit {

  subscription: Subscription[] = []
  totalAccessFormActions = []
  historyGridColDefs: ColDef[] = [
    {field: 'code', headerName: 'کد'},
    {field: 'title', headerName: 'عنوان'},
  ]

  currentHistoryIndex: number = -1
  gridOptions: GridOptions = {
    pagination: false,
  }
  @Input() selectedRow: any
  @Input() hasCriteria: boolean

  @Input() set gridHistory(data: any) {
    this.grid.addRows([data])
    this.currentHistoryIndex += 1;
  }

  @Input() form: IFetchFormRes
  @Input() colDefs: ColDef[]

  @Input() set accessFormActions(data: ACCESS_FORM_ACTION_TYPE[]) {
    if (data.length) {
      data.forEach(item => {
        this.allAccessFormActions.forEach(action => {
          if (action.type === item) this.totalAccessFormActions.push(action)
        })
      })
      this.totalAccessFormActions.sort((a, b) => a['order'] - b['order'])
    }
  }

  @ViewChild('grid', {read: CustomGridComponent}) grid: CustomGridComponent
  @ViewChild('criteriaBuilder', {read: CriteriaBuilderComponent}) criteriaBuilder: CriteriaBuilderComponent

  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() onAction: EventEmitter<ACCESS_FORM_ACTION_TYPE> = new EventEmitter<ACCESS_FORM_ACTION_TYPE>()
  @Output() onAddCriteria: EventEmitter<any> = new EventEmitter<any>()

  //TODO صحبت با آقای عبدالهی برای ترتیب آیکون ها
  allAccessFormActions = [
    {
      icon: "pi pi-arrow-up",
      styleClass: "p-button-rounded",
      type: ACCESS_FORM_ACTION_TYPE.PERV,
      tooltip: "سطح قبلی",
      order: 0
    },
    {
      icon: "pi pi-arrow-down",
      styleClass: "p-button-rounded",
      type: ACCESS_FORM_ACTION_TYPE.NEXT,
      tooltip: "سطح بعدی",
      order: 1
    },
    {
      icon: "pi pi-plus",
      styleClass: "p-button-rounded",
      type: ACCESS_FORM_ACTION_TYPE.ADD,
      tooltip: "ایجاد رکورد جدید",
      order: 2
    },
    {
      icon: "pi pi-pencil",
      styleClass: "p-button-rounded p-button-secondary",
      type: ACCESS_FORM_ACTION_TYPE.UPDATE,
      tooltip: "ویرایش",
      order: 3
    },
    {
      icon: "pi pi-trash",
      styleClass: "p-button-rounded p-button-danger",
      type: ACCESS_FORM_ACTION_TYPE.DELETE,
      tooltip: "حذف", order: 4
    },
    {
      icon: "pi pi-download",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.EXPORT,
      tooltip: "دانلود فایل اکسل",
      order: 5
    },
    {
      icon: "pi pi-upload",
      styleClass: "p-button-rounded p-button-warning",
      type: ACCESS_FORM_ACTION_TYPE.IMPORT,
      tooltip: "آپلود فایل اکسل",
      order: 6
    },
    {
      icon: "pi pi-paperclip",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.ATTACHMENTS,
      tooltip: "ضمیمه ها",
      order: 7
    },
    {
      icon: "pi pi-paperclip",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.CONFIRM_DOC,
      tooltip: "ضمیمه ها",
      order: 8
    },
    {
      icon: "pi pi-paperclip",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.ALL,
      tooltip: "ضمیمه ها",
      order: 9
    },
    {
      icon: "pi pi-trash",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.DELETE_ALL,
      tooltip: "حذف همه",
      order: 10
    },
    {
      icon: "pi pi-file-export",
      styleClass: "p-button-rounded p-button-success",
      type: ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE,
      tooltip: "دانلود فایل",
      order: 11
    },
    {
      icon: "pi pi-filter",
      styleClass: "p-button-rounded",
      type: ACCESS_FORM_ACTION_TYPE.ADVANCE_SEARCH,
      tooltip: "جستجوی پیشرفته",
      order: 12
    },
    {
      icon: "pi pi-filter-slash",
      styleClass: "p-button-rounded",
      type: ACCESS_FORM_ACTION_TYPE.RESET_ADVANCE_SEARCH,
      tooltip: "حذف نتایج جستجو",
      order: 13
    }
  ]

  constructor(
    private storageService: StorageService
  ) {
  }

  get ACCESS_FORM_ACTION_TYPE(): typeof ACCESS_FORM_ACTION_TYPE {
    return ACCESS_FORM_ACTION_TYPE
  }

  get FORM_KIND(): typeof FORM_KIND {
    return FORM_KIND
  }

  // @HostListener('document:keydown', ['$event'])
  // onKeydown(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     // if (this.selectedByArrowKey) {
  //     //   this.selectedNode = this.selectedByArrowKey
  //     //   this.currentHistoryIndex = this.grid.getCellPosition.rowIndex
  //     // }
  //     // if (!this.selectedNode) this.selectedNode = this.grid.gridApi.getDisplayedRowAtIndex(this.currentHistoryIndex)?.data;
  //     // this.handleClickRow(this.selectedNode, this.currentHistoryIndex)
  //   }
  //   //TODO نمی دونم چرا داره شرط currentHistoryIndex چک میشه
  //   if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && this.currentHistoryIndex >= 0) {
  //     this.selectedByArrowKey = this.grid.getRowDataByIndex(this.grid.getCellPosition.rowIndex)
  //   }
  // }

  ngOnInit(): void {

  }

  handleDisableIcon(actionType: ACCESS_FORM_ACTION_TYPE) {
    if (actionType === ACCESS_FORM_ACTION_TYPE.PERV || actionType === ACCESS_FORM_ACTION_TYPE.NEXT) {
      return !this.grid.rowDataCount ||
        (actionType === ACCESS_FORM_ACTION_TYPE.PERV ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.grid.rowDataCount - 1)
    }
    if (actionType === ACCESS_FORM_ACTION_TYPE.RESET_ADVANCE_SEARCH) {
      return !this.hasCriteria
    }
    return (
      actionType === ACCESS_FORM_ACTION_TYPE.UPDATE ||
      actionType === ACCESS_FORM_ACTION_TYPE.DELETE ||
      actionType === ACCESS_FORM_ACTION_TYPE.ATTACHMENTS ||
      actionType === ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE
    ) ? !(!!this.selectedRow) : false
  }

  handleConfirmationConfig(type: ACCESS_FORM_ACTION_TYPE) {
    if (type === ACCESS_FORM_ACTION_TYPE.DELETE || type === ACCESS_FORM_ACTION_TYPE.DELETE_ALL) {
      return {confirmation: true, header: type === ACCESS_FORM_ACTION_TYPE.DELETE ? 'حذف رکورد' : 'حذف همه رکورد ها'}
    }
    return null
  }

  handleEnterKeyDownOnGrid($event) {
    this.handleClickGridRow($event, this.grid.focusedCell.rowIndex)
  }

  handleClickGridRow(rowData, rowIndex) {
    if (rowIndex !== this.grid.rowNodes.length - 1) {
      const removeRowData = []
      this.grid.rowNodes.forEach(node => {
        if (node.rowIndex > rowIndex) removeRowData.push(node.data)
      })
      this.handleRemoveHistories(removeRowData)
      this.currentHistoryIndex = rowIndex
      this.clickHistory.emit(rowData)
    }
  }

  handleClickPrev() {
    this.handleRemoveHistories([this.grid.getRowDataByIndex(this.currentHistoryIndex)])
    this.currentHistoryIndex -= 1;
    const rowData = this.currentHistoryIndex === -1 ? null : this.grid.getRowDataByIndex(this.currentHistoryIndex);
    this.clickHistory.emit(rowData)
  }

  handleRemoveHistories(removeRowData: any[]) {
    this.grid.removeByRowData(removeRowData)
    this.grid.selectLastRow()
    const removeIdList = removeRowData.map(row => row.id)
    const dataSessionList = []
    const getSessionData = this.storageService.getSessionStorage(multiLevelGridInfo);
    getSessionData.forEach(item => {
      if ((removeIdList.indexOf(item.historyId)) === -1) dataSessionList.push(item)
    })
    dataSessionList.forEach((item, index) => {
      if (index === dataSessionList.length - 1) {
        //TODO برا ی page , page size , criteria هم باید بنویسی
        item.selectedChildId = removeIdList[0]
        item.sort = getSessionData.find(item => item.historyId === removeIdList[0]).originalSort
      }
    })
    this.storageService.setSessionStorage(multiLevelGridInfo, dataSessionList)
  }

  handleClickNex() {
    // this.currentHistoryIndex += 1;
    // if (this.currentHistoryIndex < this.grid.rowDataCount) {
    //   const rowData = this.grid.getRowDataByIndex(this.currentHistoryIndex);
    //   this.grid.selectLastRow()
    // }
  }

  handleResetCriteria() {
    this.criteriaBuilder.handleResetForm()
  }

  handleClickAction(type) {
    switch (type) {
      case ACCESS_FORM_ACTION_TYPE.PERV:
        this.handleClickPrev()
        break
      case ACCESS_FORM_ACTION_TYPE.NEXT:
        this.handleClickNex()
        break
      case ACCESS_FORM_ACTION_TYPE.ADD:
      case ACCESS_FORM_ACTION_TYPE.UPDATE:
      case ACCESS_FORM_ACTION_TYPE.IMPORT:
      case ACCESS_FORM_ACTION_TYPE.ATTACHMENTS:
      case ACCESS_FORM_ACTION_TYPE.DELETE:
      case ACCESS_FORM_ACTION_TYPE.DELETE_ALL:
      case ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE:
      case ACCESS_FORM_ACTION_TYPE.ADVANCE_SEARCH:
      case ACCESS_FORM_ACTION_TYPE.EXPORT:
      case ACCESS_FORM_ACTION_TYPE.RESET_ADVANCE_SEARCH:
        this.onAction.emit(type)
        break
    }
  }

}

@NgModule({
  declarations: [GridActionsComponent],
  imports: [
    NgFor,
    NgClass,
    NgIf,
    CustomButtonModule,
    CriteriaBuilderModule,
    CustomGridModule,
    AgGridModule
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
