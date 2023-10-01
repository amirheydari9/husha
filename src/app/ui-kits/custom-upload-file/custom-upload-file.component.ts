import {Component, EventEmitter, Input, NgModule, OnInit, Output, Self} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";
import {FieldErrorModule} from "../field-error/field-error.component";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FileService} from "../../utils/file.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-custom-upload-file',
  template: `
    <div class="flex align-items-center">
      <input type="file" (change)="onFileSelect($event)" class=""/>
      <img *ngIf="image" [src]="image" width="75" height="75" style="border-radius: 50%" class="mr-2"/>
    </div>
    <app-field-error [formField]="control"></app-field-error>
  `,
})
export class CustomUploadFileComponent extends BaseControlValueAccessor<File> implements OnInit {

  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();

  @Input() type: string = 'image'

  control: FormControl
  image: string

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

  async onFileSelect($event: any) {
    this.image = ''
    const file = $event.target.files.length > 0 ? $event.target.files[0] as File : null;
    this.fileSelected.emit(file);
    this.changed(file);
    this.touched();
    if (this.type === 'image') {
      this.image = file ? await this.fileService.convertFileToBase64(file) : ''
    }
  }

}

@NgModule({
  declarations: [CustomUploadFileComponent],
  imports: [
    FieldErrorModule,
    NgIf
  ],
  exports: [CustomUploadFileComponent]
})
export class CustomUploadFileModule {

}
