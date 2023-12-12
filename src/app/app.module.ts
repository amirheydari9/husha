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
import {CustomToastModule} from "./ui-kits/custom-toast/custom-toast.component";
import {DialogService} from "primeng/dynamicdialog";
import {ServiceWorkerModule} from '@angular/service-worker';
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {BaseInfoGridComponent, BaseInfoGridModule} from "./components/base-info-grid/base-info-grid.component";

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
    CustomToastModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    // {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    DialogService,
    BaseInfoGridModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
