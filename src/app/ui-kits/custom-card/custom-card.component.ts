import {Component, Input, NgModule, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-custom-card',
  template: `
    <p-card dir="rtl" [styleClass]="styleClass" [header]="header">
      <ng-content></ng-content>
    </p-card>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      .p-card-content {
        //padding: 0;
      }
    }
  `]
})
export class CustomCardComponent implements OnInit {

  @Input() header: string
  @Input() styleClass: string

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [CustomCardComponent],
  imports: [
    CardModule
  ],
  exports: [CustomCardComponent]
})
export class CustomCardModule {

}
