import {Injectable} from '@angular/core';
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

  downloadBase64(data, name) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', data, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const databaseArray = new Uint8Array(xhr.response);
        const blob = new Blob([databaseArray], {type: 'application/octet-stream'});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name
        link.click();
      }
    };
    xhr.send();
  }
}
