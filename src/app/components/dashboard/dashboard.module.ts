import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from './sidenav/sidenav.component';
import {DashboardComponent} from "./dashboard.component";
import {RouterModule} from "@angular/router";
import {SubLevelMenuComponent} from "./sidenav/sub-level-menu.component";
import {BodyComponent} from "./body/body.component";
import {HeaderComponent} from './header/header.component';
import {UserAvatarComponent} from "./header/user-avatar/user-avatar.component";
import {BaseInfoStore} from "../../data-core/base-info/base-info.store";
import {TabMenuComponent} from "./body/tab-menu/tab-menu.component";
import {MenuModule} from "primeng/menu";
import {OauthStore} from "../../data-core/oauth/oauth.store";
import {AvatarModule} from "primeng/avatar";
import {CustomerStore} from "../../data-core/customer/customer.store";
import {CascadeMenuModule} from "../cascade-menu/cascade-menu.component";
import {CdkMenuModule} from "@angular/cdk/menu";
import {HeaderMenuComponent} from './header/header-menu/header-menu.component';
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    BodyComponent,
    SubLevelMenuComponent,
    HeaderComponent,
    UserAvatarComponent,
    HeaderMenuComponent,
    TabMenuComponent
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BaseInfoStore,
    MenuModule,
    OauthStore,
    AvatarModule,
    CustomerStore,
    CascadeMenuModule,
    CdkMenuModule,
    DragDropModule
  ]
})
export class DashboardModule {
}
