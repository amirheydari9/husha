import {AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {BaseInfoGridComponent} from "../../components/base-info-grid/base-info-grid.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDTO} from "../../models/DTOs/fetch-form.DTO";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@AutoUnsubscribe()
@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <ng-container #container></ng-container>
    <app-dynamic-dialog-actions
      [disabled]="!selectedRow"
      (confirmed)="ref.close(this.selectedRow)"
      (closed)="ref.close()"
    ></app-dynamic-dialog-actions>
  `,
  styles: []
})
export class LookupFormDialogComponent implements AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef
  selectedRow: any
  subscription: Subscription

  constructor(
    private cdr: ChangeDetectorRef,
    private baseInfoService: BaseInfoService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    dynamicDialogConfig.header = dynamicDialogConfig.data.field.caption
  }

  ngAfterViewInit(): void {
    this.baseInfoService.fetchForm(new FetchFormDTO(this.dynamicDialogConfig.data.field.lookUpForm)).subscribe(form => {
      const comRef = this.container.createComponent(BaseInfoGridComponent)
      comRef.setInput('form', form)
      comRef.setInput('fetchSummary', true)
      this.subscription = comRef.instance.onRowClicked.subscribe(data => this.selectedRow = data)
      this.cdr.detectChanges()
    })
  }
}
