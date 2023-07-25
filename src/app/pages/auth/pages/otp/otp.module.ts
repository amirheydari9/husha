import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OtpComponent} from './otp.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    OtpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: OtpComponent}])
  ]
})
export class OtpModule { }
