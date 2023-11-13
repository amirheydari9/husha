import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {NgClass, NgFor, NgIf} from "@angular/common";
import {ACCESS_FORM_ACTION_TYPE} from "../../constants/enums";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {ExportExcelDialogModule} from "../dialog/export-excel-dialog/export-excel-dialog.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-3">
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
    <div class="mb-3 border-2" *ngIf="gridHistory.length">
      <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">
            <span #history class="cursor-pointer p-2" [ngClass]="{'border-bottom-2': i !== gridHistory.length-1}"
                  (click)="handleClickHistory(item,i)">{{item.code}} - {{item.title}}</span>
      </div>
    </div>
<!--    <ng-container *ngIf="showExportExcelDialog">-->
<!--      <app-export-excel-dialog-->
<!--        [visible]="showExportExcelDialog"-->
<!--        [source]="exportExcelSource"-->
<!--      ></app-export-excel-dialog>-->
<!--    </ng-container>-->

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridActionsComponent implements OnInit {

  subscription: Subscription[] = []
  totalAccessFormActions = []

  currentHistoryIndex: number
  @Input() selectedRow: any
  @Input() gridHistory = []
  @Input() exportExcelSource = []
  showExportExcelDialog = false

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

  @ViewChildren('history') history: QueryList<ElementRef>

  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() onAction: EventEmitter<ACCESS_FORM_ACTION_TYPE> = new EventEmitter<ACCESS_FORM_ACTION_TYPE>()

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
    }
  ]

  constructor() {
  }

  get ACCESS_FORM_ACTION_TYPE(): typeof ACCESS_FORM_ACTION_TYPE {
    return ACCESS_FORM_ACTION_TYPE
  }

  handleDisableIcon(actionType: ACCESS_FORM_ACTION_TYPE) {
    if (actionType === ACCESS_FORM_ACTION_TYPE.PERV || actionType === ACCESS_FORM_ACTION_TYPE.NEXT) {
      return !this.gridHistory.length || (actionType === ACCESS_FORM_ACTION_TYPE.PERV ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.gridHistory.length - 1)
    }
    return (actionType === ACCESS_FORM_ACTION_TYPE.UPDATE || actionType === ACCESS_FORM_ACTION_TYPE.DELETE || actionType === ACCESS_FORM_ACTION_TYPE.ATTACHMENTS) ? !(!!this.selectedRow) : false
  }

  handleConfirmationConfig(type: ACCESS_FORM_ACTION_TYPE) {
    if (type === ACCESS_FORM_ACTION_TYPE.DELETE || type === ACCESS_FORM_ACTION_TYPE.DELETE_ALL) {
      return {confirmation: true, header: type === ACCESS_FORM_ACTION_TYPE.DELETE ? 'حذف رکورد' : 'حذف همه رکورد ها'}
    }
    return null
  }

  ngOnInit(): void {

  }

  activeHistory(i: number) {
    this.currentHistoryIndex = i
    this.resetActiveHistory()
    this.history.get(i).nativeElement.classList.add('bg-primary')
  }

  resetActiveHistory() {
    this.history.map(item => item.nativeElement.classList.remove('bg-primary'))
  }

  handleClickHistory(item, i) {
    this.activeHistory(i)
    this.clickHistory.emit(item)
  }

  handleClickPrev() {
    this.currentHistoryIndex -= 1;
    this.currentHistoryIndex === -1 ? this.resetActiveHistory() : this.activeHistory(this.currentHistoryIndex)
    this.clickHistory.emit(this.currentHistoryIndex === -1 ? null : this.gridHistory[this.currentHistoryIndex])

  }

  handleClickNex() {
    this.currentHistoryIndex += 1;
    this.activeHistory(this.currentHistoryIndex)
    this.clickHistory.emit(this.gridHistory[this.currentHistoryIndex])
  }

  handleExportExcel() {
    this.showExportExcelDialog = true
  }

  handleClickAction(type) {
    switch (type) {
      case ACCESS_FORM_ACTION_TYPE.PERV :
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
        this.onAction.emit(type)
        break
      case ACCESS_FORM_ACTION_TYPE.EXPORT:
        this.handleExportExcel()
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
    // ExportExcelDialogModule,
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
