import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PanelRoutingModule} from './panel-routing.module';
import {PanelComponent} from "./panel.component";
import {DashboardModule} from "../../components/dashboard/dashboard.module";
import {BaseInfoStore} from "../../data-core/base-info/base-info.store";


@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    DashboardModule,
    BaseInfoStore
  ]
})
export class PanelModule {
}
