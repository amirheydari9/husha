import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgetPasswordComponent} from './forget-password.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ForgetPasswordComponent}])
  ]
})
export class ForgetPasswordModule {
}
