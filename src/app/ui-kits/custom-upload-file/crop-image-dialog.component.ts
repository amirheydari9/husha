import {Component} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ImageTransform} from "ngx-image-cropper";

@Component({
  selector: 'app-crop-image-dialog',
  template: `
    <div class="mb-3 flex align-items-center">
      <!--      <button (click)="rotateLeft()">Rotate left</button>-->
      <!--      <button (click)="rotateRight()">Rotate right</button>-->
      <!--      <button (click)="resetImage()">Reset image</button>-->
      <!--      <button (click)="zoomOut()">Zoom -</button>-->
      <!--      <button (click)="zoomIn()">Zoom +</button>-->
      <app-custom-button
        icon="pi pi-sync"
        class="ml-1"
        label="بازگشت به حالت اول"
        (onClick)="resetImage()"
      ></app-custom-button>
      <app-custom-button
        icon="pi pi-undo"
        class="ml-1"
        label="چرخش به چپ"
        (onClick)="rotateRight()"
      ></app-custom-button>
      <app-custom-button
        icon="pi pi-refresh"
        class="ml-1"
        label="چرخش به راست"
        (onClick)="rotateLeft()"
      ></app-custom-button>
      <app-custom-button
        icon="pi pi-search-minus"
        class="ml-1"
        label="کوچکنمایی"
        (onClick)="zoomOut()"
      ></app-custom-button>
      <app-custom-button
        icon="pi pi-search-plus"
        class="ml-1"
        label="بزرگنمایی نمایی"
        (onClick)="zoomIn()"
      ></app-custom-button>
    </div>
    <image-cropper
      [imageChangedEvent]="imageChangedEvent"
      [maintainAspectRatio]="false"
      [aspectRatio]="4 / 3"
      format="jpeg"
      (imageCropped)="croppedImage = $event.blob"
      [(transform)]="transform"
      [alignImage]="'center'"
      output="blob"
      [canvasRotation]="canvasRotation"
    ></image-cropper>
    <app-dynamic-dialog-actions
      (confirmed)="handleClose()"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
  styles: []
})
export class CropImageDialogComponent {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  scale = 1;
  loading = false;
  transform: ImageTransform = {
    translateUnit: 'px'
  };
  translateH = 0;
  translateV = 0;

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.imageChangedEvent = this.dynamicDialogConfig.data.image
    this.dynamicDialogConfig.header = 'کراپ تصویر'
    this.dynamicDialogConfig.closable = true
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {
      translateUnit: 'px'
    };
  }

  rotateLeft() {
    this.loading = true;
    setTimeout(() => {
      this.canvasRotation--;
      this.flipAfterRotate();
    });
  }

  rotateRight() {
    this.loading = true;
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  handleClose() {
    this.ref.close(this.croppedImage)
  }
}
