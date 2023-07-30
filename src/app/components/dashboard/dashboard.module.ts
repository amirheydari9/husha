import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from './sidenav/sidenav.component';
import {DashboardComponent} from "./dashboard.component";
import {RouterModule} from "@angular/router";
import {SubLevelMenuComponent} from "./sidenav/sub-level-menu.component";
import {BodyComponent} from "./body/body.component";
import {HeaderComponent} from './header/header.component';
import {UserAvatarModule} from "../user-avatar/user-avatar.component";
import {MyCustomersNodule} from "../my-customers/my-customers.component";
import {BaseInfoStore} from "../../data-core/base-info/base-info.store";
import {TabMenuModule} from "../tab-menu/tab-menu.component";


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    BodyComponent,
    SubLevelMenuComponent,
    HeaderComponent
  ],
  exports: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        UserAvatarModule,
        MyCustomersNodule,
        BaseInfoStore,
        TabMenuModule
    ]
})
export class DashboardModule {
}
