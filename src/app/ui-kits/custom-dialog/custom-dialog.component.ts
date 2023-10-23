import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {SharedModule} from "primeng/api";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {CustomButtonModule} from "../custom-button/custom-button.component";

@Component({
  selector: 'app-custom-dialog',
  template: `
    <p-dialog
      appendTo="body"
      [(visible)]="showDialog"
      [closable]="false"
      [modal]="true"
      [draggable]="true"
      [rtl]="true"
      [resizable]="false"
      [maximizable]="true"
      [style]="{'height': height,'width':width,'min-height':'50vh'}"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-bold">{{header}}</span>
      </ng-template>
      <ng-content></ng-content>
      <ng-template pTemplate="footer">
        <div class="flex align-items-center flex-row-reverse">
          <app-custom-button
            icon="pi pi-times"
            label="بستن"
            (onClick)="closed.emit()"
            styleClass="p-button-danger"
          ></app-custom-button>
          <app-custom-button
            icon="pi pi-check"
            label="تایید"
            (onClick)="confirmed.emit()"
          ></app-custom-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class CustomDialogComponent implements OnInit {

  @Input() showDialog: boolean;
  @Input() header: string;
  @Input() width: string = '65vw';
  @Input() height: string = 'auto';
  @Output() deleteSelf = new EventEmitter<any>();

  @Output()
  confirmed: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  closed: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [CustomDialogComponent],
  imports: [
    SharedModule,
    DialogModule,
    ButtonModule,
    CustomButtonModule,
  ],
  exports: [CustomDialogComponent]
})
export class CustomDialogModule {

}
