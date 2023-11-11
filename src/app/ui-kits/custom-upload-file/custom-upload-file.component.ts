import {Component, HostListener, NgModule, OnInit, Self} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";
import {FieldErrorModule} from "../field-error/field-error.component";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FileService} from "../../utils/file.service";
import {NgClass, NgIf} from "@angular/common";
import {CustomButtonModule} from "../custom-button/custom-button.component";

@Component({
  selector: 'app-custom-upload-file',
  template: `
    <div class="flex align-items-center wrapper background-white p-2"
         [ngClass]="[control.invalid &&( control.dirty || control.touched) ? 'error-border' :'border-2']">
      <app-custom-button type="button" label="Choose file" (onClick)="touched();input.click()" icon="pi pi-plus"></app-custom-button>
      <span class="font-sm-regular mr-2">{{selectedFile ? selectedFile.name : 'or drag and drop file here' }}</span>
      <img *ngIf="value" [src]="value" width="75" height="75" style="border-radius: 50%" class="mr-2"/>
      <input #input class="hidden" type="file">
    </div>
    <div style="height: 20px">
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles: [`
    @import "../../../scss/variabels";

    .wrapper {
      border-radius: 8px;
      height: 90px;
    }
  `]
})
export class CustomUploadFileComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl
  selectedFile: File

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
  async changeFiles(fileList: FileList) {
    this.selectedFile = fileList && fileList.item(0);
    let fileToBase64: string = null
    if (this.selectedFile) fileToBase64 = await this.fileService.convertFileToBase64(this.selectedFile)
    this.changed(fileToBase64);
  }
}

@NgModule({
  declarations: [CustomUploadFileComponent],
  imports: [
    FieldErrorModule,
    NgIf,
    NgClass,
    CustomButtonModule
  ],
  exports: [CustomUploadFileComponent]
})
export class CustomUploadFileModule {

}
