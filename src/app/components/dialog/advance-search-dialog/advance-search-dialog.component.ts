import {Component, NgModule} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";

@Component({
  selector: 'app-advance-search-dialog',
  templateUrl: './advance-search-dialog.component.html',
  styleUrls: ['./advance-search-dialog.component.scss']
})
export class AdvanceSearchDialogComponent {

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    dynamicDialogConfig.header = 'جستجوی پیشرفته'
  }

  handleClose() {

  }
}

@NgModule({
  declarations: [AdvanceSearchDialogComponent],
  imports: [
    DynamicDialogActionsModule
  ],
  exports: [AdvanceSearchDialogComponent]
})
export class AdvanceSearchDialogModule {

}
