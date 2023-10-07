import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}])
  ]
})
export class CreateModule {
}
