import {Injectable} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogManagementService {

  constructor(
    private dialogService: DialogService
  ) {
  }

  dialogConfig: DynamicDialogConfig = {
    maximizable: true,
    rtl: true,
    draggable: true,
    resizable: true,
    modal: true,
    width: '50vw',
    height: '50vh',
    // closable: false,
    // closeOnEscape: false
  }

  openDialog(component: any, options?: DynamicDialogConfig): Observable<any> {
    const config = {...this.dialogConfig, ...options}
    const dialogClosedSubject: Subject<any> = new Subject<any>();
    const ref: DynamicDialogRef = this.dialogService.open(component, config);
    ref.onClose.subscribe(data => {
      dialogClosedSubject.next(data);
      dialogClosedSubject.complete();
    });
    return dialogClosedSubject.asObservable();
  }
}
