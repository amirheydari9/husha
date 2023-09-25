import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CustomConfirmDialogModule} from "../custom-confirm-dialog/custom-confirm-dialog.component";

@Component({
  selector: 'app-custom-button',
  template: `
    <div [class]="class">
      <p-button
        styleClass="p-button-sm"
        [type]="type"
        [label]="label"
        [styleClass]="styleClass"
        [loading]="loading"
        [disabled]="disabled"
        [icon]="icon"
        iconPos="right"
        [style]="{'width':'100%'}"
        (onClick)="handleClick($event)"
      ></p-button>
    </div>
    <app-custom-confirm-dialog
      [header]="confirmationHeader"
      [message]="confirmationText"
      [(visible)]="showConfirmDialog"
      (accepted)="confirm.emit()"
    ></app-custom-confirm-dialog>
  `,
  styles: [`
    ::ng-deep .p-button {
      font-size: 12px !important;

      .p-button-icon-right {
        margin-right: 0.5rem;
        margin-left: 0;
      }
    }
  `]
})
export class CustomButtonComponent {

  @Input() type = 'submit';

  @Input() label: string;

  @Input() class: string;

  @Input() styleClass: string;

  @Input() loading: boolean;

  @Input() disabled: boolean;

  @Input() icon: string;

  @Input() confirmation: boolean = false

  @Input() confirmationText: string

  @Input() confirmationHeader: string

  @Output() onclick: EventEmitter<void> = new EventEmitter<void>();

  @Output() confirm: EventEmitter<void> = new EventEmitter<any>();

  showConfirmDialog: boolean = false

  handleClick($event: any): void {
    this.confirmation ? this.showConfirmDialog = true : this.onclick.emit($event);
  }
}

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [ButtonModule, ButtonModule, CustomConfirmDialogModule],
  exports: [CustomButtonComponent]
})
export class CustomButtonModule {

}

