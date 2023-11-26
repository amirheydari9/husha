import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {AttachmentComponent} from './attachment.component';
import {GridActionsModule} from "../../../../components/grid-actions/grid-actions.component";
import {AttachmentDialogModule} from "../../../../components/dialog/attachment-dialog/attachment-dialog.component";
import {CustomGridModule} from "../../../../ui-kits/custom-grid/custom-grid.component";


@NgModule({
  declarations: [
    AttachmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AttachmentComponent}]),
    GridActionsModule,
    AttachmentDialogModule,
    CustomGridModule
  ],
})
export class AttachmentModule {
}
