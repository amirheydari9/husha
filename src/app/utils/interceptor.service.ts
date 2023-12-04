import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {catchError, filter, finalize, map, Observable, of, takeUntil, tap, throwError} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {AppConfigService} from "./app-config.service";
import {environment} from "../../environments/environment";
import {OauthFacade} from "../data-core/oauth/oauth.facade";
import {NotificationService} from "../ui-kits/custom-toast/notification.service";
import {showNotification} from "../constants/keys";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable()
export class InterceptorService implements HttpInterceptor {

  TOKEN_HEADER_KEY = 'Authorization';
  private _cache: Map<string, { expireDate: Date, response: HttpResponse<any> }> = new Map()


  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
    private oauthFacade: OauthFacade,
    private spinner: NgxSpinnerService
  ) {
    router.events.subscribe(event => {
      // if (event instanceof NavigationEnd) this.appConfigService.cancelPendingRequests();
    });
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    if (!request.url.startsWith('/assets')) {
      request = request.clone({url: environment.baseUrl.concat(request.url)})
      const cacheResponse = this._cache.get(request.urlWithParams)
      if (cacheResponse && cacheResponse.expireDate <= new Date()) {
        this._cache.delete(request.urlWithParams)
        return this._sendRequest(request, next)
      }
      return cacheResponse ? of(new HttpResponse<any>({body: cacheResponse.response})) : this._sendRequest(request, next);
    } else {
      return next.handle(request);
    }
  }

  private _sendRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.appConfigService.setLoading(true)
    this.spinner.show();
    const token = this.tokenStorageService.getToken();
    if (token) {
      request = this.addTokenHeader(request, token)
    }
    return next.handle(request).pipe(
      takeUntil(this.appConfigService.onCancelPendingRequests()),
      filter(res => res instanceof HttpResponse),
      map((response: HttpResponse<any>) => this.handleResponse(request, response)),
      catchError(error => {
        if (error instanceof HttpErrorResponse) this.errorHandler(error)
        return throwError(error);
      }),
      finalize(() => {
        this.spinner.hide()
        this.appConfigService.setLoading(false)
      })
    )
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({headers: request.headers.set(this.TOKEN_HEADER_KEY, 'Bearer ' + token)});
  }

  private handleResponse(req: HttpRequest<any>, res: HttpResponse<any>): HttpResponse<any> {
    if (res.body.error) {
      throw new HttpErrorResponse({status: 400, error: res.body.error})
    } else {
      if (['PUT', 'PATCH', 'DELETE'].indexOf(req.method) !== -1 || req.headers.get(showNotification)) {
        this.notificationService.success('موفق', 'عملیات موردنظر با موفقیت انجام شد')
      }
      const response = res.body.response
      if (req.method === "GET") {
        const expireDate = new Date(Date.now() + environment.cacheTimeForHttpRequest)
        this._cache.set(req.urlWithParams, {expireDate, response})
      }
      return res.clone({body: response});
    }
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error.message) {
        this.notificationService.error(error.error.message);
      } else if (error.error.errors?.length) {
        error.error.errors.forEach(item => this.notificationService.error(item.summary));
      }
    } else if (error.status === 401) {
      // خروج به استثنا زمانی که داره لاگین میکنه
      this.oauthFacade.logout()
    } else if (error.status === 403) {
      this.router.navigate(['/error/not-allowed'])
    } else if (error.status === 404) {
      this.router.navigate(['/error/not-found'])
    } else if (error.status === 500 || error.status === 502 || error.status === 504) {
      this.router.navigate(['/error/server-error'])
    }
  }
}
