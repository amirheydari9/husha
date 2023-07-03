import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NotFoundRoutingModule} from './not-found-routing.module';
import {NotFoundComponent} from './not-found.component';
import {SvgIconModule} from "../../../components/svg-icon/svg-icon.component";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    SvgIconModule,
    RouterModule
  ]
})
export class NotFoundModule {
}
