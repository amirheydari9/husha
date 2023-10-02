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
import {NgFor} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-multi-level-grid-history',
  template: `
    <div class="flex justify-content-start mb-2">
      <p-button *ngFor="let action of actions" [icon]="action.icon" [styleClass]="action.styleClass"
                [pTooltip]="action.tooltip" class="mr-1" (click)="handleNextPrev(action.step)"></p-button>
    </div>
    <div class="flex flex-column" *ngFor="let item of multiLevelHistory;let i = index">
      <span #history class="cursor-pointer" (click)="handleClick(item,i)">
        {{item.title}}-{{item.id}}</span>
    </div>
  `,
  styles: []
})
export class MultiLevelGridHistoryComponent implements OnInit {

  @Input() multiLevelHistory = []
  @ViewChildren('history') history: QueryList<ElementRef>
  @Output() clickHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() resetHistory: EventEmitter<any> = new EventEmitter<any>()

  currentIndex: number

  actions = [
    {icon: "pi pi-arrow-right", styleClass: "p-button-rounded", step: 'prev', tooltip: "سطح قبلی"},
    {icon: "pi pi-arrow-left", styleClass: "p-button-rounded", step: 'next', tooltip: "سطح بعدی"},
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

  handleClick(item, i) {
    this.activeHistory(i)
    this.clickHistory.emit(item)
  }

  handleNextPrev(step: string) {
    if (step === 'prev') {
      if (this.currentIndex === 0) {
        this.resetHistory.emit()
        this.clickHistory.emit(null)
      } else {
        this.activeHistory(this.currentIndex - 1)
        this.clickHistory.emit(this.multiLevelHistory[this.currentIndex])
      }
    } else {
      if (this.currentIndex !== this.multiLevelHistory.length - 1) {
        this.activeHistory(this.currentIndex + 1)
        this.clickHistory.emit(this.multiLevelHistory[this.currentIndex])
      }
    }
  }


}

@NgModule({
  declarations: [MultiLevelGridHistoryComponent],
  imports: [NgFor, ButtonModule, TooltipModule],
  exports: [MultiLevelGridHistoryComponent]
})
export class MultiLevelGridHistoryModule {

}
