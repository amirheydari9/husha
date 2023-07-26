import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PhoneComponent} from './phone.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CaptchaModule} from "../../../../components/captcha/captcha.component";
import {HushaButtonModule} from "../../../../ui-kits/husha-button/husha-button.component";
import {HushaInputTextModule} from "../../../../ui-kits/husha-input-text/husha-input-text.component";


@NgModule({
  declarations: [
    PhoneComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: PhoneComponent}]),
    ReactiveFormsModule,
    CaptchaModule,
    HushaButtonModule,
    HushaInputTextModule
  ]
})
export class PhoneModule {
}
