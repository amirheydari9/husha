import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgetPasswordComponent} from './forget-password.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CustomInputPasswordModule} from "../../../../ui-kits/custom-input-password/custom-input-password.component";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";


@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ForgetPasswordComponent}]),
    ReactiveFormsModule,
    CustomInputPasswordModule,
    CustomButtonModule
  ]
})
export class ForgetPasswordModule {
}
