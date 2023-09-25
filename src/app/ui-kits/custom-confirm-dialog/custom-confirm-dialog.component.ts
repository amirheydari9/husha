import {Component, EventEmitter, Input, NgModule, Output, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog, ConfirmDialogModule} from 'primeng/confirmdialog';

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

  @Input() public width = '25vw';

  @Input() public message = 'آیا از انجام این کار مطمئن هستید ؟';

  @Input() public header: string = 'تاییده';

  @Input() public icon = 'pi pi-info-circle';

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
