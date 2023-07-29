import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PanelRoutingModule} from './panel-routing.module';
import {PanelComponent} from "./panel.component";
import {DashboardModule} from "../../components/dashboard/dashboard.module";


@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    DashboardModule,
  ]
})
export class PanelModule {
}
