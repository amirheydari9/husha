import {ElementRef, Injectable} from '@angular/core';
import imageCompression from "browser-image-compression";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {
  }

  convertCanvasToBase64(canvas) {
    return canvas.toDataURL('image/png')
  }

  createFile(blob, fileName = 'image.png'): File[] {
    return [new File([blob], fileName, {
      type: blob.type,
      lastModified: new Date().getTime()
    })]
  }

  convertCanvasToFile(canvas): Promise<File[]> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const files = this.createFile(blob, 'image.png')
        resolve(files)
      })
    })
  }

  async convertBase64ToFile(base64, name = 'name'): Promise<File[]> {
    const blob = await (await fetch(base64)).blob();
    return this.createFile(blob, name)
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async compressImage(file): Promise<Blob> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    }
    return await imageCompression(file, options);
  }
}
