import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {SharedModule} from "primeng/api";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-custom-dialog',
  template: `
    <p-dialog
      appendTo="body"
      [(visible)]="showDialog"
      [closable]="true"
      [modal]="true"
      (onHide)="handleOnHIde()"
      [draggable]="true"
      [rtl]="true"
      [resizable]="false"
      [maximizable]="true"
      [style]="{'height': height,'width':width}"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-bold">{{header}}</span>
      </ng-template>
      <ng-content></ng-content>
      <!--      <ng-template pTemplate="footer">-->
      <!--        <p-button icon="pi pi-check" label="Ok" styleClass="p-button-text"></p-button>-->
      <!--      </ng-template>-->
      <!--            <p-footer>-->
      <!--              <button type="button" pButton label="Close" (click)="handleOnHIde()"></button>-->
      <!--            </p-footer>-->
    </p-dialog>
  `
})
export class CustomDialogComponent implements OnInit {

  @Input() showDialog: boolean;
  @Input() header: string;
  @Input() width: string = '65vw';
  @Input() height: string = '65vh';
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
  declarations: [CustomDialogComponent],
  imports: [
    SharedModule,
    DialogModule,
    ButtonModule,
  ],
  exports: [CustomDialogComponent]
})
export class CustomDialogModule {

}
