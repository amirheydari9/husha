import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
  }

  private subject = new Subject<any>();

  callNotification$(): Observable<any> {
    return this.subject.asObservable();
  }

  success(summary: string, detail: string): void {
    this.subject.next({severity: 'success', summary, detail});
  }

  info(summary: string, detail: string): void {
    this.subject.next({severity: 'info', summary, detail});
  }

  warning(summary: string, detail: string): void {
    this.subject.next({severity: 'warn', summary, detail});
  }

  error(detail: string): void {
    this.subject.next({severity: 'error', summary: 'خطایی رخ داده است', detail});
  }
}
