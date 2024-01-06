import {Injectable} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable, Subject} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class DialogManagementService {

  ref: DynamicDialogRef

  constructor(
    private dialogService: DialogService,
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ref?.close()
      }
    })
  }

  dialogConfig: DynamicDialogConfig = {
    maximizable: true,
    rtl: true,
    draggable: true,
    resizable: true,
    modal: true,
    width: '50vw',
    height: 'auto',
    closable: false,
    // closeOnEscape: false
    keepInViewport: true
  }


  openDialog(component: any, options?: DynamicDialogConfig): Observable<any> {
    const config = {...this.dialogConfig, ...options}
    const dialogClosedSubject: Subject<any> = new Subject<any>();
    this.ref = this.dialogService.open(component, config);
    this.ref.onClose.subscribe(data => {
      dialogClosedSubject.next(data);
      dialogClosedSubject.complete();
    });
    return dialogClosedSubject.asObservable();
  }
}
