import {Component, Input, NgModule} from '@angular/core';
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {NotificationService} from "./notification.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-custom-toast',
  template: `
    <p-toast [baseZIndex]="5000" [position]="position"></p-toast>`,
  styles: [`
    :host ::ng-deep .p-toast .p-toast-message .p-toast-message-content .p-toast-message-text {
      margin: 0 1rem 0 1rem;
    }
  `]
})
export class CustomToastComponent {

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
        //TODO clear this code after update
        setTimeout(() => {
          this.messageService.clear()
        },3000)
      }
    );
  }

  addSingleNotification({severity, summary, detail}): void {
    this.messageService.add({severity, summary, detail, life: 3000, sticky: true});
  }
}

@NgModule({
  declarations: [CustomToastComponent],
  imports: [
    ToastModule
  ],
  exports: [CustomToastComponent],
  providers: [MessageService]
})
export class CustomToastModule {

}
