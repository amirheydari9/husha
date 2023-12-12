import {Component, NgModule, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {CommonModule} from "@angular/common";
import {CriteriaOperationPipeModule} from "../../../pipes/criteria-operation.pipe";
import {DividerModule} from "primeng/divider";
import {CriteriaBuilderModule} from "../../criteria-builder/criteria-builder.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-advance-search-dialog',
  templateUrl: './advance-search-dialog.component.html',
  styleUrls: ['./advance-search-dialog.component.scss'],
})
export class AdvanceSearchDialogComponent implements OnInit {

  criteriaList = []

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    dynamicDialogConfig.header = 'جستجوی پیشرفته'
    dynamicDialogConfig.height = '50vh'
  }

  ngOnInit() {
    if (this.dynamicDialogConfig.data.criteria) {
      this.criteriaList = this.dynamicDialogConfig.data.criteria
    }
  }

  handleAddCriteria(criteria: any) {
    this.criteriaList.unshift({
      id: this.criteriaList.length + 1,
      ...criteria,
    })
  }

  removeCriteria(id) {
    this.criteriaList = this.criteriaList.filter(cr => cr.id !== id)
  }

}

@NgModule({
  declarations: [AdvanceSearchDialogComponent],
  imports: [
    DynamicDialogActionsModule,
    CommonModule,
    CriteriaOperationPipeModule,
    DividerModule,
    CriteriaBuilderModule
  ],
  exports: [AdvanceSearchDialogComponent],
})
export class AdvanceSearchDialogModule {

}
