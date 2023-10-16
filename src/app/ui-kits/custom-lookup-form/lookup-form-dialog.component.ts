import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {IFormField} from "../../models/interface/fetch-form-res.interface";
import {BaseInfoGridComponent} from "../../components/base-info-grid/base-info-grid.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDTO} from "../../models/DTOs/fetch-form.DTO";

@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <app-custom-dialog header="title" (closed)="handleClosed()" [showDialog]="visible">
      <ng-container #container></ng-container>
    </app-custom-dialog>
  `,
  styles: []
})
export class LookupFormDialogComponent implements AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef

  @Input() field: IFormField
  @Input() visible: boolean = false
  @Output() visibleChange:EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private cdr: ChangeDetectorRef,
    private baseInfoService: BaseInfoService
  ) {
  }

  ngAfterViewInit(): void {
    this.baseInfoService.fetchForm(new FetchFormDTO(this.field.lookUpForm)).subscribe(form => {
      const comRef = this.container.createComponent(BaseInfoGridComponent)
      comRef.setInput('form', form)
      comRef.setInput('fetchSummary', true)
      comRef.setInput('showCrudActions', false)
      this.cdr.detectChanges()
    })
  }

  handleClosed() {
    this.visibleChange.emit(false)
  }
}
