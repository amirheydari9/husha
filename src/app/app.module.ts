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
import {HushaToastModule} from "./ui-kits/husha-toast/husha-toast.component";

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
    HushaToastModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
