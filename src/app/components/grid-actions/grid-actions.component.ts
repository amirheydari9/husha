import {
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
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {NgFor, NgIf} from "@angular/common";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {FORM_KIND} from "../../constants/enums";
import {Router} from "@angular/router";

@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-2">

      <ng-container *ngIf="showPrevNext">
        <p-button *ngFor="let action of historyActions" [icon]="action.icon" [styleClass]="action.styleClass"
                  [pTooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"
                  [disabled]="!gridHistory.length || (action.type === 'prev' ? this.currentHistoryIndex === -1 : this.currentHistoryIndex === this.gridHistory.length - 1)"
        ></p-button>
      </ng-container>

      <p-button *ngFor="let action of actions" [icon]="action.icon" [styleClass]="action.styleClass"
                [pTooltip]="action.tooltip" class="mr-1" (onClick)="handleClickAction(action.type)"></p-button>
    </div>
    <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">
      <span #history class="cursor-pointer" (click)="handleClickHistory(item,i)">{{item.title}}-{{item.id}}</span>
    </div>
  `,
  styles: []
})
export class GridActionsComponent implements OnInit {

  currentHistoryIndex: number
  showPrevNext: boolean
  @Input() selectedRow: any
  @Input() gridHistory = []

  private _form
  @Input() set form(data: IFetchFormRes) {
    this.showPrevNext = data?.formKind.id === FORM_KIND.MULTI_LEVEL
    this._form = data
  }

  get form(): IFetchFormRes {
    return this._form
  }

  @ViewChildren('history') history: QueryList<ElementRef>

  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()

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
    private router: Router
  ) {
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
      case 'import':
        this.handleImport()
        break
    }
  }

  handleImport() {
    this.router.navigate([`/form/${this.form.id}/import`])
  }
}

@NgModule({
  declarations: [GridActionsComponent],
  imports: [
    ButtonModule,
    TooltipModule,
    NgFor,
    NgIf
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
