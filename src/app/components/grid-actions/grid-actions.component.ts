import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {ACCESS_FORM_ACTION_TYPE, FORM_KIND} from "../../constants/enums";
import {Router} from "@angular/router";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchAccessActionDTO} from "../../models/DTOs/fetch-access-action.DTO";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-3">
      <ng-container *ngIf="showPrevNext">
        <app-custom-button
          *ngFor="let action of historyActions" type="button" [icon]="action.icon" [styleClass]="action.styleClass"
          [tooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"
          [disabled]="!gridHistory.length || (action.type === 'prev' ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.gridHistory.length - 1)"
        ></app-custom-button>
      </ng-container>
      <ng-container *ngIf="showCrudActions">
        <app-custom-button
          *ngFor="let action of actions" type="button" [icon]="action.icon" [styleClass]="action.styleClass"
          [disabled]="handleDisableIcon(action.type)"
          [tooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"
          [confirmationConfig]="action.type=== ACCESS_FORM_ACTION_TYPE.DELETE? {confirmation:true,header:'حذف رکورد'} : null"
          (confirm)="onDelete.emit(this.selectedRow)"
        ></app-custom-button>
      </ng-container>
    </div>
    <div class="mb-3 border-2" *ngIf="gridHistory.length">
      <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">
        <span #history class="cursor-pointer p-2" [ngClass]="{'border-bottom-2': i !== gridHistory.length-1}"
              (click)="handleClickHistory(item,i)">{{item.code}} - {{item.title}}</span>
      </div>
    </div>
  `,
  styles: []
})
export class GridActionsComponent implements OnInit, OnChanges {

  subscription: Subscription[] = []

  currentHistoryIndex: number
  showPrevNext: boolean
  @Input() selectedRow: any
  @Input() gridHistory = []
  @Input() form: IFetchFormRes
  @Input() showCrudActions: boolean

  @ViewChildren('history') history: QueryList<ElementRef>

  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
  @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>()
  @Output() onCreate: EventEmitter<void> = new EventEmitter<void>()
  @Output() onImport: EventEmitter<void> = new EventEmitter<void>()

  historyActions = [
    {icon: "pi pi-arrow-up", styleClass: "p-button-rounded", type: 'prev', tooltip: "سطح قبلی"},
    {icon: "pi pi-arrow-down", styleClass: "p-button-rounded", type: 'next', tooltip: "سطح بعدی"},
  ]

  //TODO از کجا بفهمبم فرم ایمپورت اسکپورت داره ؟
  actions = [
    {
      icon: "pi pi-download",
      styleClass: "p-button-rounded p-button-success",
      type: 'export',
      tooltip: "دانلود فایل اکسل"
    }
  ]

  constructor(
    private router: Router,
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
  }

  get ACCESS_FORM_ACTION_TYPE(): typeof ACCESS_FORM_ACTION_TYPE {
    return ACCESS_FORM_ACTION_TYPE
  }

  handleDisableIcon(actionType){
     return (actionType === ACCESS_FORM_ACTION_TYPE.UPDATE || actionType === ACCESS_FORM_ACTION_TYPE.DELETE || actionType === 'attachment') ? !(!!this.selectedRow) :false
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']?.currentValue) {
      const form: IFetchFormRes = changes['form'].currentValue
      this.showPrevNext = form.formKind.id === FORM_KIND.MULTI_LEVEL
      if (form.hasFormImport) {
        this.actions.push({
          icon: "pi pi-upload",
          styleClass: "p-button-rounded p-button-warning",
          type: 'import',
          tooltip: "آپلود فایل اکسل"
        })
      }
      if (form.formKind.id === FORM_KIND.MASTER) {
        this.actions.push({
          icon: "pi pi-paperclip",
          styleClass: "p-button-rounded p-button-success",
          type: 'attachment',
          tooltip: "ضمیمه ها"
        })
      }
      if (changes['showCrudActions'].currentValue) {
        const payload = new FetchAccessActionDTO(
          this.hushaCustomerUtilService.customer.id,
          this.hushaCustomerUtilService.service.id,
          this.hushaCustomerUtilService.unit.id,
          form.id,
        )
        this.subscription.push(
          this.baseInfoService.accessFormAction(payload).subscribe(actions => {
            actions.forEach(item => {
              if (item.action === this.ACCESS_FORM_ACTION_TYPE.ADD) {
                this.actions.unshift({
                  icon: "pi pi-plus",
                  styleClass: "p-button-rounded",
                  type: ACCESS_FORM_ACTION_TYPE.ADD,
                  tooltip: "ایجاد رکورد جدید"
                })
              } else if (item.action === this.ACCESS_FORM_ACTION_TYPE.UPDATE) {
                this.actions.unshift({
                  icon: "pi pi-pencil",
                  styleClass: "p-button-rounded p-button-secondary",
                  type: ACCESS_FORM_ACTION_TYPE.UPDATE,
                  tooltip: "ویرایش"
                })
              } else if (item.action === this.ACCESS_FORM_ACTION_TYPE.DELETE) {
                this.actions.unshift({
                  icon: "pi pi-trash",
                  styleClass: "p-button-rounded p-button-danger",
                  type: ACCESS_FORM_ACTION_TYPE.DELETE,
                  tooltip: "حذف"
                })
              }
            })
          })
        )
      }
    }
  }

  ngOnInit(): void {
//TODO نمابش کد به جای آی دی در هیستوری
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

  handleClickAction(type) {
    switch (type) {
      case 'prev' :
        this.handleClickPrev()
        break
      case 'next':
        this.handleClickNex()
        break
      case ACCESS_FORM_ACTION_TYPE.ADD:
        this.onCreate.emit(this.selectedRow)
        break
      case ACCESS_FORM_ACTION_TYPE.UPDATE:
        this.onUpdate.emit(this.selectedRow)
        break
      case 'import':
        this.onImport.emit()
        break
      case 'attachment':
        this.router.navigate([`/form/${this.form.id}/attachment/${this.selectedRow.id}`])
        break
    }
  }
}

@NgModule({
  declarations: [GridActionsComponent],
  imports: [
    NgFor,
    NgIf,
    CustomButtonModule,
    CommonModule
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
