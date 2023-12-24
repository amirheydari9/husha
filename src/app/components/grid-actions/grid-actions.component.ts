import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  HostListener
} from '@angular/core';
import { NgClass, NgFor, NgIf } from "@angular/common";
import { ACCESS_FORM_ACTION_TYPE } from "../../constants/enums";
import { CustomButtonModule } from "../../ui-kits/custom-button/custom-button.component";
import { AutoUnsubscribe } from "../../decorators/AutoUnSubscribe";
import { Subscription } from "rxjs";
import { CriteriaBuilderComponent, CriteriaBuilderModule } from "../criteria-builder/criteria-builder.component";
import { IFetchFormRes } from "../../models/interface/fetch-form-res.interface";
import { ColDef, GridOptions, RowClickedEvent } from "ag-grid-community";
import { CustomGridComponent, CustomGridModule } from "../../ui-kits/custom-grid/custom-grid.component";
import { AgGridModule } from "ag-grid-angular";
import { BaseInfoGridComponent } from '../base-info-grid/base-info-grid.component';
@AutoUnsubscribe({ arrayName: 'subscription' })
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
    <!-- *ngIf="historyLength" -->
    <div class="mb-3" >
      <!--      <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">-->
      <!--        <span-->
      <!--          #history-->
      <!--          class="cursor-pointer p-2"-->
      <!--          [ngClass]="{'border-bottom-2': i !== gridHistory.length-1}"-->
      <!--          (click)="handleClickHistory(item,i)">{{item.code}} - {{item.title}}-->
      <!--        </span>-->
      <!--      </div>-->
      <app-custom-grid
        #grid
        [columnDefs]="historyGridColDefs"
        (rowClicked)="handleClickHistoryGridRow($event)"
        [gridOptions]="gridOptions"
      ></app-custom-grid>
    </div>
  `,
  styles: [],
})
export class GridActionsComponent implements OnInit {
  [x: string]: any;

  subscription: Subscription[] = []
  totalAccessFormActions = []
  historyGridColDefs: ColDef[] = [
    { field: 'code', headerName: 'کد' },
    { field: 'title', headerName: 'عنوان' },
  ]

  currentHistoryIndex: number= -1
  _gridHistory: any[];
  selectedNode: any;
  historyLength:number;
  gridOptions :GridOptions={
    pagination: false,
  }
  @Input() selectedRow: any
  @Input() hasCriteria: boolean
  @Input() set gridHistory (data){
    if ( data ) {
      this._gridHistory = data;
      this.grid.gridApi.applyTransaction({add:[this._gridHistory]}) 
      this.getDisplayedRowsCount();   
      this.selectLastRow();
      this.currentHistoryIndex += 1;
    }
  }
  
  get gridHistory(): any[] {      
    return this._gridHistory;
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

  @ViewChild('grid', {static:false ,read: CustomGridComponent}) grid: CustomGridComponent
  @ViewChild('baseInfo',{read:BaseInfoGridComponent})baseInfo:BaseInfoGridComponent
  @ViewChildren('history') history: QueryList<ElementRef>
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

  constructor() {
  }

  get ACCESS_FORM_ACTION_TYPE(): typeof ACCESS_FORM_ACTION_TYPE {
    return ACCESS_FORM_ACTION_TYPE
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (!this.selectedNode) this.selectedNode = this.grid.gridApi.getDisplayedRowAtIndex(this.currentHistoryIndex)?.data;
      // this.rowIndex = ;
      this.handleClickPrev(this.selectedNode, this.currentHistoryIndex)
    }
  }

  handleDisableIcon(actionType: ACCESS_FORM_ACTION_TYPE) {
    if (actionType === ACCESS_FORM_ACTION_TYPE.PERV || actionType === ACCESS_FORM_ACTION_TYPE.NEXT) {
      return !this.historyLength || (actionType === ACCESS_FORM_ACTION_TYPE.PERV ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.historyLength-1)
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

  ngOnInit(): void {

  }

  // activeHistory(i: number) {
  //   this.currentHistoryIndex = i
  //   this.resetActiveHistory()
  //   this.history.get(i).nativeElement.classList.add('bg-primary')
  // }
  //
  // resetActiveHistory() {
  //   this.history.map(item => item.nativeElement.classList.remove('bg-primary'))
  // }
  //
  // handleClickHistory(item, i) {
  //   this.activeHistory(i)
  //   this.clickHistory.emit(item)
  // }

  handleClickPrev(rowData, rowIndex) {
    if (this.currentHistoryIndex > -1) {
      if (rowData) {
        this.grid.gridApi.forEachNode((node) => {
          if (node.id > (rowIndex)?.toString()) {
            this.grid.gridApi.applyTransaction({ remove: [node.data] });
            this.currentHistoryIndex -= 1
          }
        })
        this.selectedNode = rowData;
      }
      else {
        this.grid.gridApi.applyTransaction({ remove: [this.grid.gridApi.getDisplayedRowAtIndex(this.currentHistoryIndex).data] });
        this.currentHistoryIndex -= 1;
        this.currentHistoryIndex == -1 ? this.selectedNode = null : this.selectedNode =(this.grid.gridApi.getDisplayedRowAtIndex(this.currentHistoryIndex).data);
      }
      this.grid.gridApi.forEachNode((node) => node.setSelected(node.data === this.selectedNode))
      this.getDisplayedRowsCount();
      this.clickHistory.emit(this.selectedNode)
    }
  }

  handleClickNex() {
    this.currentHistoryIndex += 1;
    if (this.currentHistoryIndex < this.historyLength){
      this.selectedNode = this.grid.gridApi.getDisplayedRowAtIndex(this.currentHistoryIndex);
      this.grid.gridApi.forEachNode((node) => node.setSelected(node === this.selectedNode))
    }
  }

  handleResetCriteria() {
    this.criteriaBuilder.handleResetForm()
  }

  handleClickAction(type) {
    switch (type) {
      case ACCESS_FORM_ACTION_TYPE.PERV:
        this.handleClickPrev(null, null)
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

  handleClickHistoryGridRow($event: RowClickedEvent<any>) {
    this.handleClickPrev($event.data, $event.rowIndex);
  }

  getDisplayedRowsCount(){
    this.historyLength = this.grid.gridApi.getDisplayedRowCount()    
  }

  selectLastRow(){
    if (this.historyLength >= 0) {
      const totalPages = Math.ceil((this.historyLength + 1) / this.grid.gridApi.paginationGetPageSize());     
      const lastPageNumber = totalPages > 0 ? totalPages - 1 : 0;      
      this.grid.gridApi.paginationGoToPage(lastPageNumber);
      this.grid.gridApi.forEachNode((node) => node.setSelected(node.rowIndex === this.historyLength-1))
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
