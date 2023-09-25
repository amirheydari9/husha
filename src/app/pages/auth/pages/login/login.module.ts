import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CaptchaModule} from "../../../../components/captcha/captcha.component";
import {CustomInputTextModule} from "../../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomInputPasswordModule} from "../../../../ui-kits/custom-input-password/custom-input-password.component";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: LoginComponent}]),
    ReactiveFormsModule,
    CaptchaModule,
    CustomInputTextModule,
    CustomInputPasswordModule,
    CustomButtonModule,
  ]
})
export class LoginModule {
}
