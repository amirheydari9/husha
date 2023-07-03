import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class InjectTagToDocumentService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  createLinkTag(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const links = Array.from(this.document.getElementsByTagName('link'));
      if (links.find((item) => item.href === href)) {
        resolve();
        return;
      }
      const newLink = this.document.createElement('link');
      newLink.href = href;
      newLink.type = 'text/css';
      newLink.rel = 'stylesheet';
      newLink.onload = () => resolve()
      newLink.onerror = () => reject();
      this.document.head?.appendChild(newLink);
    })
  }

  createScriptTag(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const links = Array.from(this.document.getElementsByTagName('script'));
      if (links.find((item) => item.src === src)) {
        resolve();
        return;
      }
      const newScript = this.document.createElement('script');
      newScript.src = src;
      newScript.type = 'text/javascript';
      newScript.onload = () => resolve()
      newScript.onerror = () => reject();
      this.document.head?.appendChild(newScript);
    })
  }
}
