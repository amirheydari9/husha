import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OtpComponent} from './otp.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {NgOtpInputModule} from "ng-otp-input";
import {CountdownModule} from "ngx-countdown";
import {HushaButtonModule} from "../../../../ui-kits/husha-button/husha-button.component";


@NgModule({
  declarations: [
    OtpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: OtpComponent}]),
    ReactiveFormsModule,
    NgOtpInputModule,
    CountdownModule,
    HushaButtonModule
  ]
})
export class OtpModule { }
