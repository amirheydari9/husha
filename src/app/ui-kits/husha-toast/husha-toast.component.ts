import {Component, Input, NgModule, OnInit} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {NotificationService} from "./notification.service";

@AutoUnsubscribe()
@Component({
  selector: 'app-husha-toast',
  template: `
    <p-toast [baseZIndex]="5000" [position]="position"></p-toast>`,
  styles: [`
    :host ::ng-deep .p-toast .p-toast-message .p-toast-message-content .p-toast-message-text {
      margin: 0 1rem 0 1rem;
    }
  `]
})
export class HushaToastComponent implements OnInit {

  @Input() position: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-center' | 'center' = 'top-center';

  private subscription: Subscription;

  constructor(
    private messageService: MessageService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.notificationService.callNotification$().subscribe(notification => {
        this.addSingleNotification(notification);
      }
    );
  }

  addSingleNotification({severity, summary, detail}): void {
    this.messageService.add({severity, summary, detail, life: 3000, sticky: true});
  }

}

@NgModule({
  declarations: [HushaToastComponent],
  imports: [
    ToastModule
  ],
  exports: [HushaToastComponent],
  providers: [MessageService]
})
export class HushaToastModule {

}
