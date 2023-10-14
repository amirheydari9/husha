import {ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {BaseInfoGridComponent} from "../../components/base-info-grid/base-info-grid.component";

@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <ng-container #container></ng-container>
  `,
  styles: []
})
export class LookupFormDialogComponent implements OnInit {

  @Input() form: IFetchFormRes
  @Input() field: IFormField

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    const comRef = this.container.createComponent(BaseInfoGridComponent)
    comRef.setInput('form', this.form)
    comRef.setInput('fetchSummary', true)
    comRef.setInput('showCrudActions', false)
    this.cdr.detectChanges()
  }

}
