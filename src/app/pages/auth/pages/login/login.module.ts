import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {HushaInputTextModule} from "../../../../ui-kits/husha-input-text/husha-input-text.component";
import {HushaInputPasswordModule} from "../../../../ui-kits/husha-input-password/husha-input-password.component";


@NgModule({
  declarations: [
    LoginComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([{path: '', component: LoginComponent}]),
        ReactiveFormsModule,
        HushaInputTextModule,
        HushaInputPasswordModule
    ]
})
export class LoginModule {
}
