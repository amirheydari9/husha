import {Component, EventEmitter, Input, NgModule, Output, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog, ConfirmDialogModule} from 'primeng/confirmdialog';

export interface ConfirmationConfig {
  confirmation: boolean;
  header?: string;
  message?: string;
  width?: string
}

@Component({
  selector: 'app-custom-confirm-dialog',
  template: `
    <p-confirmDialog
      #cd
      [visible]="visible"
      (onHide)="visibleChange.emit(false)"
      [style]="{width: width}"
      [baseZIndex]="10000"
      [message]="message"
      [closable]="false"
      appendTo="body">
      <ng-template pTemplate="header">
        <div class="flex flex-row align-items-center">
          <i [class]="icon" style="font-size:1.3rem"></i>
          <h3 class="mr-1">{{header}}</h3>
        </div>
      </ng-template>
      <ng-template pTemplate="footer">
        <button type="button" pButton icon="pi pi-check" class="p-button-text" label="بله"
                (click)="handleAccepted()"></button>
        <button type="button" pButton icon="pi pi-times" class="p-button-rounded  p-button-danger" label="خیر"
                (click)="cd.reject()"></button>
      </ng-template>
    </p-confirmDialog>
  `,
})
export class CustomConfirmDialogComponent {

  @Input() public visible: boolean = false

  width = '25vw';

  message: string = 'آیا از انجام این کار مطمئن هستید ؟'

  header: string = 'تایید'

  @Input() public icon = 'pi pi-info-circle';

  @Input() set confirmationConfig(data: ConfirmationConfig) {
    if (data) {
      this.header = data.header ?? this.header
      this.message = data.message ?? this.message
      this.width = data.width ?? this.width
    }
  }

  @Output() accepted: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  @ViewChild('cd') cd: ConfirmDialog

  handleAccepted() {
    this.cd.accept()
    this.accepted.emit(true)
  }
}

@NgModule({
  declarations: [CustomConfirmDialogComponent],
  imports: [ConfirmDialogModule],
  exports: [CustomConfirmDialogComponent],
  providers: [ConfirmationService]
})
export class CustomConfirmDialogModule {
}
