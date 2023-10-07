import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateComponent} from './update.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UpdateComponent}])
  ]
})
export class UpdateModule {
}
