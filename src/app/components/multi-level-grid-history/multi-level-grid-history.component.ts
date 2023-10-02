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

@Component({
  selector: 'app-multi-level-grid-history',
  template: `
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

  constructor() {
  }

  ngOnInit(): void {
  }

  activeHistory(i: number) {
    this.history.map(item => item.nativeElement.classList.remove('bg-primary'))
    this.history.get(i).nativeElement.classList.add('bg-primary')
  }

  handleClick(item, i) {
    this.activeHistory(i)
    this.clickHistory.emit(item)
  }
}

@NgModule({
  declarations: [MultiLevelGridHistoryComponent],
  imports: [NgFor],
  exports: [MultiLevelGridHistoryComponent]
})
export class MultiLevelGridHistoryModule {

}
