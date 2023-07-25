import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgetPasswordComponent} from './forget-password.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {HushaInputPasswordModule} from "../../../../ui-kits/husha-input-password/husha-input-password.component";
import {HushaButtonModule} from "../../../../ui-kits/husha-button/husha-button.component";


@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ForgetPasswordComponent}]),
    ReactiveFormsModule,
    HushaInputPasswordModule,
    HushaButtonModule
  ]
})
export class ForgetPasswordModule {
}
