import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {AttachmentComponent} from './attachment.component';
import {AgGridModule} from "ag-grid-angular";
import {GridActionsModule} from "../../../../components/grid-actions/grid-actions.component";
import {AttachmentDialogModule} from "../../../../components/dialog/attachment-dialog/attachment-dialog.component";


@NgModule({
  declarations: [
    AttachmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AttachmentComponent}]),
    AgGridModule,
    GridActionsModule,
    AttachmentDialogModule
  ],
})
export class AttachmentModule {
}
