import {Component, EventEmitter, HostListener, Input, NgModule, OnInit, Output, Self} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";
import {FieldErrorModule} from "../field-error/field-error.component";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FileService} from "../../utils/file.service";
import {NgIf} from "@angular/common";
import {CustomButtonModule} from "../custom-button/custom-button.component";

export type fileUploadType = 'image' | 'document'

@Component({
  selector: 'app-custom-upload-file',
  template: `
    <div class="flex align-items-center wrapper background-white p-2">
      <app-custom-button label="Choose file" (onclick)="input.click()" icon="pi pi-plus"></app-custom-button>
      <span class="font-sm-regular mr-2">{{file ? file.name : 'or drag and drop file here' }}</span>
      <img *ngIf="fileToBase64" [src]="fileToBase64" width="75" height="75" style="border-radius: 50%" class="mr-2"/>
      <input #input class="hidden" type="file">
    </div>
    <app-field-error [formField]="control"></app-field-error>
  `,
  styles: [`
    @import "../../../scss/variabels";

    .wrapper {
      border: 1px solid $color-2;
      border-radius: 8px;
      height: 90px;
    }
  `]
})
export class CustomUploadFileComponent extends BaseControlValueAccessor<File> implements OnInit {

  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();

  @Input() fileUploadType: fileUploadType = 'image'

  control: FormControl
  file: File
  fileToBase64: string

  constructor(
    @Self() public controlDir: NgControl,
    private fileService: FileService
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  @HostListener('change', ['$event.target.files'])
  async emitFiles(fileList: FileList) {
    this.fileToBase64 = ''
    this.file = fileList && fileList.item(0);
    this.fileSelected.emit(this.file);
    this.changed(this.file);
    this.touched();
    if (this.fileUploadType === 'image') {
      this.fileToBase64 = this.file ? await this.fileService.convertFileToBase64(this.file) : ''
    }
  }
}

@NgModule({
  declarations: [CustomUploadFileComponent],
  imports: [
    FieldErrorModule,
    NgIf,
    CustomButtonModule
  ],
  exports: [CustomUploadFileComponent]
})
export class CustomUploadFileModule {

}
