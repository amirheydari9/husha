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

@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-2">

      <ng-container *ngIf="gridHistory.length">
        <p-button *ngFor="let action of historyActions" [icon]="action.icon" [styleClass]="action.styleClass"
                  [pTooltip]="action.tooltip" class="mr-1" (click)="handleClickAction(action.type)"></p-button>
      </ng-container>

      <p-button *ngFor="let action of actions" [icon]="action.icon" [styleClass]="action.styleClass"
                [pTooltip]="action.tooltip" class="mr-1" (click)="handleClickAction(action.type)"></p-button>
    </div>
    <div class="flex flex-column" *ngFor="let item of gridHistory;let i = index">
      <span #history class="cursor-pointer" (click)="handleClickHistory(item,i)">
        {{item.title}}-{{item.id}}</span>
    </div>
  `,
  styles: []
})
export class GridActionsComponent implements OnInit {

  currentIndex: number

  @Input() selectedRow: any
  @Input() gridHistory = []
  @ViewChildren('history') history: QueryList<ElementRef>

  @Output() prev: EventEmitter<any> = new EventEmitter<any>()
  @Output() next: EventEmitter<any> = new EventEmitter<any>()
  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() resetHistory: EventEmitter<any> = new EventEmitter<any>()


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

  constructor() {
  }

  ngOnInit(): void {
  }

  activeHistory(i: number) {
    this.currentIndex = i
    this.history.map(item => item.nativeElement.classList.remove('bg-primary'))
    this.history.get(i).nativeElement.classList.add('bg-primary')
  }

  handleClickHistory(item, i) {
    this.activeHistory(i)
    this.clickHistory.emit(item)
  }

  handleClickPrev() {
    if (this.currentIndex === 0) {
      this.resetHistory.emit()
      this.clickHistory.emit(null)
    } else {
      this.activeHistory(this.currentIndex - 1)
      this.clickHistory.emit(this.gridHistory[this.currentIndex])
    }
  }

  handleClickNex() {
    if (this.currentIndex !== this.gridHistory.length - 1) {
      this.activeHistory(this.currentIndex + 1)
      this.clickHistory.emit(this.gridHistory[this.currentIndex])
    }
  }

  handleClickAction(type) {
    switch (type) {
      case 'prev' :
        this.handleClickPrev()
        break
      case 'next':
        this.handleClickNex()
        break
    }
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
