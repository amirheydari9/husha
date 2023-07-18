import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {SharedModule} from "primeng/api";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-husha-dialog',
  template: `
    <p-dialog
      [contentStyle]="{'height': '256px','width':'500px' }"
      [(visible)]="showDialog"
      header="Resize me!"
      [closable]="true"
      [modal]="true"
      (onHide)="handleOnHIde()"
      [draggable]="true"
      [rtl]="true"
    >
      <ng-content></ng-content>
      <p-footer>
        <button type="button" pButton label="Close" (click)="handleOnHIde()"></button>
      </p-footer>
    </p-dialog>
  `
})
export class HushaDialogComponent implements OnInit {

  @Input() showDialog: boolean;
  @Input() data: any;
  @Output() deleteSelf = new EventEmitter<any>();

  @Output()
  closed: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  handleOnHIde(): void {
    this.closed.emit();
  }

}

@NgModule({
  declarations: [HushaDialogComponent],
  imports: [
    SharedModule,
    DialogModule,
    ButtonModule
  ],
  exports: [HushaDialogComponent]
})
export class HushaDialogModule {

}
