import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {INavbarData} from "../components/dashboard/navbar-data.interface";

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

  private _tabMenu$: Subject<INavbarData> = new Subject<INavbarData>();
  public setTabMenu(tabMenu: INavbarData): void {
    this._tabMenu$.next(tabMenu);
  }
  public tabMenu(): Observable<INavbarData> {
    return this._tabMenu$.asObservable();
  }
}
