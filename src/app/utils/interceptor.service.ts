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
import {NavigationEnd, Router} from "@angular/router";
import {AppConfigService} from "./app-config.service";
import {environment} from "../../environments/environment";
import {NotificationService} from "../ui-kits/husha-toast/notification.service";
import {OauthFacade} from "../data-core/oauth/oauth.facade";

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
        map((res: HttpResponse<any>) => res.clone({body: res.body.response})),
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

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 400) {
      // show snackbar
    } else if (error.status === 401) {
      // خروج به استثنا زمانی که داره لاگین میکنه
      this.oauthFacade.logout()
    } else if (error.status === 403) {
      this.router.navigate(['/error/not-allowed'])
    } else if (error.status === 404) {
      this.router.navigate(['/error/not-found'])
    } else if (error.status === 500 || error.status === 502 || error.status === 504) {
      // this.router.navigate(['/error/server-error'])
    }
  }
}
