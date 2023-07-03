import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {InputPasswordModule} from "../../../../ui-kit/input-password/input-password.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {ButtonModule} from "../../../../ui-kit/button/button.component";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputPasswordModule,
    TranslateModule,
    RouterModule.forChild([{
      path: '',
      component: LoginComponent
    }]),
    ButtonModule
  ]
})
export class LoginModule {
}
