import {Component, HostListener, Input, NgModule, OnInit, Self} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";
import {FieldErrorModule} from "../field-error/field-error.component";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FileService} from "../../utils/file.service";
import {NgClass, NgIf} from "@angular/common";
import {CustomButtonModule} from "../custom-button/custom-button.component";

@Component({
  selector: 'app-custom-upload-file',
  template: `
    <div class="fle flex-column" [ngClass]="class">
      <div class="flex align-items-stretch">
        <app-custom-button type="button" label="Choose file" (onClick)="touched(); input.click()"
                           icon="pi pi-plus"></app-custom-button>
        <input #input class="hidden" type="file">
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
export class CustomUploadFileComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl
  selectedFile: File

  @Input() class

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
    this.changed(fileToBase64?.split(',')[1]);
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
