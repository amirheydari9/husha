import {Component} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-crop-image-dialog',
  template: `
    <image-cropper
      [imageChangedEvent]="imageChangedEvent"
      [maintainAspectRatio]="false"
      [aspectRatio]="4 / 3"
      format="jpeg"
      (imageCropped)="croppedImage = $event.blob"
    ></image-cropper>
    <app-dynamic-dialog-actions
      (confirmed)="handleClose()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
  styles: []
})
export class CropImageDialogComponent {

  croppedImage: any;
  imageChangedEvent: any = ''
  format: any

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.imageChangedEvent = this.dynamicDialogConfig.data.image
    this.format = this.dynamicDialogConfig.data.format
  }

  handleClose() {
    this.ref.close(this.croppedImage)
  }
}
