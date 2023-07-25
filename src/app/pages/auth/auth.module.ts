import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './auth.component';
import {OauthStore} from "../../data-core/oauth/oauth.store";
import {HushaCardModule} from "../../ui-kits/husha-card/husha-card.component";

@NgModule({
  declarations: [
    AuthComponent,
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        OauthStore,
        HushaCardModule
    ]
})
export class AuthModule {
}
