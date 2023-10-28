import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  TOKEN_KEY = 'hushaToken';

  constructor(
    private storageService: StorageService,
  ) {
  }

  public signOut(): void {
    this.storageService.removeLocalStorage(this.TOKEN_KEY)
  }

  public saveToken(token: string): void {
    this.storageService.removeLocalStorage(this.TOKEN_KEY)
    this.storageService.setLocalStorage(this.TOKEN_KEY, token)
  }

  public getToken(): string | null {
    return this.storageService.getLocalStorage(this.TOKEN_KEY);
  }

  public parseJwt() {
    const token = this.getToken()
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

}
