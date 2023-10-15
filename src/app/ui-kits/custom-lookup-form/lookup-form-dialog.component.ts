import {AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {IFormField} from "../../models/interface/fetch-form-res.interface";
import {BaseInfoGridComponent} from "../../components/base-info-grid/base-info-grid.component";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDTO} from "../../models/DTOs/fetch-form.DTO";

@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <ng-container #container></ng-container>
  `,
  styles: []
})
export class LookupFormDialogComponent implements AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef

  constructor(
    private cdr: ChangeDetectorRef,
    public config: DynamicDialogConfig,
    private baseInfoService: BaseInfoService
  ) {
  }

  ngAfterViewInit(): void {
    this.baseInfoService.fetchForm(new FetchFormDTO(this.config.data['field'].lookUpForm)).subscribe(form => {
      const comRef = this.container.createComponent(BaseInfoGridComponent)
      comRef.setInput('form', form)
      comRef.setInput('fetchSummary', true)
      comRef.setInput('showCrudActions', false)
      this.cdr.detectChanges()
    })
  }
}
