import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-grid-actions',
  template: `
    <div class="flex justify-content-end mb-2">
      <p-button *ngFor="let action of actions" [icon]="action.icon" [styleClass]="action.styleClass"
                [pTooltip]="action.tooltip" class="mr-1"></p-button>
    </div>
  `,
  styles: []
})
export class GridActionsComponent implements OnInit {

  @Input() data: any

  @Output() prev: EventEmitter<any> = new EventEmitter<any>()
  @Output() next: EventEmitter<any> = new EventEmitter<any>()

  actions = [
    {icon: "pi pi-arrow-right", styleClass: "p-button-rounded", tooltip: "سطح قبلی"},
    {icon: "pi pi-arrow-left", styleClass: "p-button-rounded", tooltip: "سطح بعدی"},
    {icon: "pi pi-plus", styleClass: "p-button-rounded", tooltip: "ایجاد رکورد جدید"},
    {icon: "pi pi-pencil", styleClass: "p-button-rounded p-button-secondary", tooltip: "ویرایش"},
    {icon: "pi pi-trash", styleClass: "p-button-rounded p-button-danger", tooltip: "حذف"},
    {icon: "pi pi-download", styleClass: "p-button-rounded p-button-success", tooltip: "دانلود فایل اکسل"},
    {icon: "pi pi-upload", styleClass: "p-button-rounded p-button-warning", tooltip: "آپلود فایل اکسل"},
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [GridActionsComponent],
  imports: [
    ButtonModule,
    TooltipModule,
    NgFor
  ],
  exports: [GridActionsComponent]
})

export class GridActionsModule {

}
