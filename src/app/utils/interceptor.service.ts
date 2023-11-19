import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {catchError, filter, finalize, map, Observable, takeUntil, throwError} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {AppConfigService} from "./app-config.service";
import {environment} from "../../environments/environment";
import {OauthFacade} from "../data-core/oauth/oauth.facade";
import {NotificationService} from "../ui-kits/custom-toast/notification.service";
import {showNotification} from "../constants/keys";

@Injectable()
export class InterceptorService implements HttpInterceptor {

  TOKEN_HEADER_KEY = 'Authorization';

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
    private oauthFacade: OauthFacade
  ) {
    router.events.subscribe(event => {
      // if (event instanceof NavigationEnd) this.appConfigService.cancelPendingRequests();
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    if (!request.url.startsWith('/assets')) {
      this.appConfigService.setLoading(true)
      request = request.clone({url: environment.baseUrl.concat(request.url)})
      const token = this.tokenStorageService.getToken();
      if (token) {
        request = this.addTokenHeader(request, token)
      }
      return next.handle(request).pipe(
        takeUntil(this.appConfigService.onCancelPendingRequests()),
        filter(res => res instanceof HttpResponse),
        // map((res: HttpResponse<any>) => res.clone({body: res.body.response})),
        map((res: HttpResponse<any>) => this.handleResponse(res, request)),
        catchError(error => {
          if (error instanceof HttpErrorResponse) this.errorHandler(error)
          return throwError(error);
        }),
        finalize(() => this.appConfigService.setLoading(false))
      )
    } else {
      return next.handle(request);
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({headers: request.headers.set(this.TOKEN_HEADER_KEY, 'Bearer ' + token)});
  }

  private handleResponse(res: HttpResponse<any>, req: HttpRequest<any>): HttpResponse<any> {
    if (res.body.error) {
      throw new HttpErrorResponse({status: 400, error: res.body.error})
    } else {
      if (['PUT', 'PATCH', 'DELETE'].indexOf(req.method) !== -1 || req.headers.get(showNotification)) {
        this.notificationService.success('موفق', 'عملیات موردنظر با موفقیت انجام شد')
      }
      return res.clone({body: res.body.response});
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
