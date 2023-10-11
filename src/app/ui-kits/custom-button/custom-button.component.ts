import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ConfirmationConfig, CustomConfirmDialogModule} from "../custom-confirm-dialog/custom-confirm-dialog.component";
import {TooltipModule} from "primeng/tooltip";
import {NgStyle} from "@angular/common";

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
        (onClick)="handleClick($event)"
        [pTooltip]="tooltip"
        [style]="{'width':fullWidth ? '100%':''}"
      ></p-button>
    </div>
    <app-custom-confirm-dialog
      [confirmationConfig]="confirmationConfig"
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

  @Input() tooltip: string;

  @Input() fullWidth: boolean = false

  @Input() confirmationConfig: ConfirmationConfig

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() confirm: EventEmitter<void> = new EventEmitter<any>();

  showConfirmDialog: boolean = false

  handleClick($event: any): void {
    this.confirmationConfig?.confirmation ? this.showConfirmDialog = true : this.onClick.emit($event);
  }
}

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [ButtonModule, ButtonModule, CustomConfirmDialogModule, TooltipModule, NgStyle],
  exports: [CustomButtonComponent]
})
export class CustomButtonModule {

}

