import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {INavbarData} from "../components/dashboard/navbar-data.interface";
import {TabMenuItemDTO} from "../components/dashboard/body/tab-menu/tab-menu.component";

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private pendingHTTPRequests$ = new Subject<void>();

  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  private _loading$: Subject<boolean> = new Subject<boolean>();

  public setLoading(loading: boolean): void {
    this._loading$.next(loading);
  }

  public loading(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _tabMenu$: Subject<TabMenuItemDTO> = new Subject<TabMenuItemDTO>();

  public setTabMenu(tabMenu: TabMenuItemDTO): void {
    this._tabMenu$.next(tabMenu);
  }

  public tabMenu(): Observable<TabMenuItemDTO> {
    return this._tabMenu$.asObservable();
  }

  public resetTabMenu$: Subject<void> = new Subject()

  public resetTabMenu() {
    this.resetTabMenu$.next();
  }

  public onResetTabMenu() {
    return this.resetTabMenu$.asObservable();
  }
}
