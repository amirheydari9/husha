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
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe()
@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <app-custom-dialog
      [header]="field.caption"
      (closed)="handleClosed()"
      (confirmed)="handleClosed(true)"
      [showDialog]="visible">
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
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() onHide: EventEmitter<any> = new EventEmitter<any>()

  selectedRow: any
  subscription: Subscription

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
      this.subscription = comRef.instance.onRowClicked.subscribe(data => this.selectedRow = data)
      this.cdr.detectChanges()
      //TODO بازنویسی با دیالوگ سرویس اگه بستن مهم نیست
    })
  }

  handleClosed(withData?: boolean) {
    this.visibleChange.emit(false)
    this.onHide.emit(withData ? this.selectedRow : null)
  }
}
