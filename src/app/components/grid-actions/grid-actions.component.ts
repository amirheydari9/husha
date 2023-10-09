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
import {NgFor, NgIf} from "@angular/common";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {FORM_KIND} from "../../constants/enums";
import {Router} from "@angular/router";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchAccessActionDTO} from "../../models/DTOs/fetch-access-action.DTO";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../constants/keys";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";
import {StorageService} from "../../utils/storage.service";

@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-2">
      <ng-container *ngIf="showPrevNext">
        <app-custom-button
          *ngFor="let action of historyActions" [icon]="action.icon" [styleClass]="action.styleClass"
          [tooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"
          [disabled]="!gridHistory.length || (action.type === 'prev' ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.gridHistory.length - 1)"
        ></app-custom-button>
      </ng-container>
      <app-custom-button
        *ngFor="let action of actions" [icon]="action.icon" [styleClass]="action.styleClass"
        [disabled]="(action.type === 'edit' || action.type === 'delete') ? !(!!selectedRow) :false"
        [tooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"
        [confirmationConfig]="action.type==='delete'? {confirmation:true,header:'حذف رکورد'} : null"
        (confirm)="onDelete.emit(this.selectedRow)"
      ></app-custom-button>
    </div>
    <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">
      <span #history class="cursor-pointer" (click)="handleClickHistory(item,i)">{{item.title}}-{{item.id}}</span>
    </div>
  `,
  styles: []
})
export class GridActionsComponent implements OnInit, OnChanges {

  selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey)
  selectedService: IGetServicesRes = this.storageService.getSessionStorage(selectedServiceKey)
  selectedUnit = this.storageService.getSessionStorage(selectedUnitKey)
  selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey)

  currentHistoryIndex: number
  showPrevNext: boolean
  @Input() selectedRow: any
  @Input() gridHistory = []
  @Input() form: IFetchFormRes

  @ViewChildren('history') history: QueryList<ElementRef>

  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()

  historyActions = [
    {icon: "pi pi-arrow-up", styleClass: "p-button-rounded", type: 'prev', tooltip: "سطح قبلی"},
    {icon: "pi pi-arrow-down", styleClass: "p-button-rounded", type: 'next', tooltip: "سطح بعدی"},
  ]

  actions = [
    {icon: "pi pi-plus", styleClass: "p-button-rounded", type: 'create', tooltip: "ایجاد رکورد جدید"},
    {icon: "pi pi-pencil", styleClass: "p-button-rounded p-button-secondary", type: 'edit', tooltip: "ویرایش"},
    {icon: "pi pi-trash", styleClass: "p-button-rounded p-button-danger", type: 'delete', tooltip: "حذف"},
    {
      icon: "pi pi-download",
      styleClass: "p-button-rounded p-button-success",
      type: 'export',
      tooltip: "دانلود فایل اکسل"
    },
    {icon: "pi pi-upload", styleClass: "p-button-rounded p-button-warning", type: 'import', tooltip: "آپلود فایل اکسل"},
  ]

  constructor(
    private router: Router,
    private baseInfoService: BaseInfoService,
    private storageService: StorageService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']?.currentValue) {
      const form = changes['form'].currentValue
      this.showPrevNext = form?.formKind.id === FORM_KIND.MULTI_LEVEL
      const payload = new FetchAccessActionDTO(
        this.selectedCustomer.id,
        // TODO this.selectedService.id,
        101,
        // TODO this.selectedUnit.id,
        71,
        form.id,
      )
      this.baseInfoService.accessFormAction(payload).subscribe(data => {
        console.log(data)
      })
    }
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

  handleClickAction(type) {
    switch (type) {
      case 'prev' :
        this.handleClickPrev()
        break
      case 'next':
        this.handleClickNex()
        break
      case 'create':
        this.router.navigate([`/form/${this.form.id}/create`])
        break
      case 'edit':
        this.router.navigate([`/form/${this.form.id}/update/${this.selectedRow.id}`])
        break
      case 'import':
        this.router.navigate([`/form/${this.form.id}/import`])
        break
    }
  }
}

@NgModule({
  declarations: [GridActionsComponent],
  imports: [
    NgFor,
    NgIf,
    CustomButtonModule
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
