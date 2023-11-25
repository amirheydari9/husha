import {Directive, EventEmitter, HostListener, NgModule, Output} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import * as XLSX from 'xlsx';

@Directive({
  selector: '[appReadExcel]',
})
export class ReadExcelDirective {

  excelSheetsObservable: Observable<any>;
  file: File
  @Output() onSheetsReady: EventEmitter<string[]> = new EventEmitter();

  constructor() {
  }

  @HostListener('change', ['$event.target'])
  onChange(target: HTMLInputElement) {
    this.file = target.files[0];
    if (this.file) {
      this.excelSheetsObservable = new Observable((subscriber: Subscriber<any>) => this.readWorkBook(subscriber));
      this.excelSheetsObservable.subscribe(d => this.onSheetsReady.emit(d));
    }
  }

  readWorkBook(subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
      subscriber.next(wb.SheetNames);
      subscriber.complete();
    }
  }

  readSheet(sheetName: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
        const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
        const header = XLSX.utils.sheet_to_json(ws, {header: 1})[0];
        const rowData = XLSX.utils.sheet_to_json(ws);
        subscriber.next({header, rowData});
        subscriber.complete();
      }
    })
  }
}


@NgModule({
  declarations: [ReadExcelDirective],
  imports: [],
  exports: [ReadExcelDirective]
})
export class ReadExcelDirectiveModule {

}
