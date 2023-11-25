import {Component, EventEmitter, HostListener, Input, NgModule, OnInit, Output, Self, ViewChild} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {CustomButtonModule} from "../custom-button/custom-button.component";
import {FieldErrorModule} from "../field-error/field-error.component";
import {NgClass} from "@angular/common";
import {FormControl, NgControl} from "@angular/forms";
import {ReadExcelDirective, ReadExcelDirectiveModule} from "../../directives/read-excel.directive";
import {Observable} from "rxjs";

@Component({
  selector: 'app-custom-import-excel',
  template: `
    <div class="fle flex-column" [ngClass]="class">
      <div class="flex align-items-stretch">
        <app-custom-button
          type="button"
          label="Choose file"
          (onClick)="touched();
          readExcel.click()"
          icon="pi pi-file-excel"></app-custom-button>
        <input appReadExcel (onSheetsReady)="onSheetsReady.emit($event)" #readExcel class="hidden" type="file">
        <div class="flex align-items-center flex-grow-1 file"
             [ngClass]="[control.invalid &&( control.dirty || control.touched) ? 'error-border' :'border-2']">
          <span class="font-sm-regular mr-2">{{selectedFile ? selectedFile.name : ''}}</span>
        </div>
      </div>
      <div style="height:20px">
        <app-field-error [formField]="control"></app-field-error>
      </div>
    </div>
  `,
  styles: [`
    @import "../../../scss/variabels";

    .file {
      border: 1px solid;
      border-radius: 6px 0 0 6px;
      border-right: unset !important;
    }

    :host ::ng-deep {
      .p-button {
        border-radius: 0 6px 6px 0;
      }
    }
    .error-border {
      border: 1px solid $forbidden;
    }

  `]
})
export class CustomImportExcelComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl
  selectedFile: File

  @Input() class: string;
  @ViewChild('readExcel', {read: ReadExcelDirective}) readExcel: ReadExcelDirective

  @Output() onSheetsReady: EventEmitter<string[]> = new EventEmitter();

  constructor(
    @Self() public controlDir: NgControl,
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  @HostListener('change', ['$event.target.files'])
  async changeFiles(fileList: FileList) {
    this.selectedFile = fileList && fileList.item(0);
    this.changed(this.selectedFile)
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  handleReadExcel(sheetName: string): Observable<any> {
    return this.readExcel.readSheet(sheetName)
  }

}

@NgModule({
  declarations: [CustomImportExcelComponent],
  imports: [
    CustomButtonModule,
    FieldErrorModule,
    NgClass,
    ReadExcelDirectiveModule
  ],
  exports: [CustomImportExcelComponent]
})
export class CustomImportExcelModule {

}
