import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PhoneComponent} from './phone.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CaptchaModule} from "../../../../components/captcha/captcha.component";
import {CustomInputTextModule} from "../../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";


@NgModule({
  declarations: [
    PhoneComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: PhoneComponent}]),
    ReactiveFormsModule,
    CaptchaModule,
    CustomInputTextModule,
    CustomButtonModule
  ]
})
export class PhoneModule {
}
