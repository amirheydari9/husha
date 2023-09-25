import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './auth.component';
import {OauthStore} from "../../data-core/oauth/oauth.store";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    OauthStore,
    CustomCardModule
  ]
})
export class AuthModule {
}
