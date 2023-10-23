import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";
import {NgxsModule} from "@ngxs/store";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {InterceptorService} from "./utils/interceptor.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, SPINNER,} from "ngx-ui-loader";
import {CustomToastModule} from "./ui-kits/custom-toast/custom-toast.component";
import {DialogService} from "primeng/dynamicdialog";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.ballSpinClockwise,
  fgsColor: 'blue',
  fgsSize: 60,
  bgsColor: 'rgba(0, 0, 0, 0.1)',
  text: 'صبر کنید',
  pbColor: 'blue',
  pbThickness: 2,
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsDispatchPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true
    }),
    CustomToastModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    // {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
