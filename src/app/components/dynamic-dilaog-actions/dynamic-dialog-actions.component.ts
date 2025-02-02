import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";

@Component({
  selector: 'app-dynamic-dialog-actions',
  template: `
    <div class="flex align-items-center flex-row-reverse mt-3">
      <app-custom-button
        icon="pi pi-times"
        label="بستن"
        (onClick)="closed.emit()"
        styleClass="p-button-danger"
        type="button"
      ></app-custom-button>
      <app-custom-button
        class="ml-1"
        icon="pi pi-check"
        label="تایید"
        (onClick)="confirmed.emit()"
        [disabled]="disabled"
      ></app-custom-button>
    </div>
  `,
  styles: []
})
export class DynamicDialogActionsComponent{

  @Input() disabled: boolean = false;

  @Output()
  confirmed: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  closed: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

}

@NgModule({
  declarations: [DynamicDialogActionsComponent],
  imports: [
    CustomButtonModule
  ],
  exports: [DynamicDialogActionsComponent]
})
export class DynamicDialogActionsModule {

}
