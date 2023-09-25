import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OtpComponent} from './otp.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {NgOtpInputModule} from "ng-otp-input";
import {CountdownModule} from "ngx-countdown";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";


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
    CustomButtonModule
  ]
})
export class OtpModule {
}
