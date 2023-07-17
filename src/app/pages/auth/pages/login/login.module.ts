import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {HushaInputTextModule} from "../../../../ui-kits/husha-input-text/husha-input-text.component";
import {HushaInputPasswordModule} from "../../../../ui-kits/husha-input-password/husha-input-password.component";
import {CardModule} from "primeng/card";
import {HushaButtonModule} from "../../../../ui-kits/husha-button/husha-button.component";
import {HushaInputNumberModule} from "../../../../ui-kits/husha-input-number/husha-input-number.component";
import {HushaTextAreaModule} from "../../../../ui-kits/husha-text-area/husha-text-area.component";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: LoginComponent}]),
    ReactiveFormsModule,
    HushaInputTextModule,
    HushaInputPasswordModule,
    CardModule,
    HushaButtonModule,
    HushaInputNumberModule,
    HushaTextAreaModule
  ]
})
export class LoginModule {
}
