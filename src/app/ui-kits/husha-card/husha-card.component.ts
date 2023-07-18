import {Component, NgModule, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-husha-card',
  template: `
    <p-card dir="rtl">
      <ng-content></ng-content>
    </p-card>
  `,
})
export class HushaCardComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [HushaCardComponent],
  imports: [
    CardModule
  ],
  exports: [HushaCardComponent]
})
export class HushaCardModule {

}
