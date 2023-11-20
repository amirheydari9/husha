import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {AttachmentComponent} from './attachment.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {GridActionsModule} from "../../../../components/grid-actions/grid-actions.component";


@NgModule({
  declarations: [
    AttachmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AttachmentComponent}]),
    ReactiveFormsModule,
    AgGridModule,
    GridActionsModule,
  ],
})
export class AttachmentModule {
}
