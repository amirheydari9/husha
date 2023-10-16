import {ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from "../ui-kits/custom-toast/notification.service";
import {hushaHttpError} from "../constants/keys";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
    private notificationService: NotificationService,
  ) {
  }

  //TODO handle Uncaught promise error
  handleError(error: any) {
    if (error instanceof Error) {
      if (error.message.includes(hushaHttpError)) {
        try {
          const errorObj = JSON.parse(error.message).error
          if (errorObj.message) {
            this.notificationService.error(errorObj.message);
          } else if (errorObj.errors && errorObj.errors.length) {
            errorObj.errors.forEach(item => this.notificationService.error(item.summary));
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
  }
}
