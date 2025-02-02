import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {BaseInfoGridComponent} from "../../../../components/base-info-grid/base-info-grid.component";
import {BaseInfoService} from "../../../../api/base-info.service";
import {FetchDetailGridFormsReqDTO} from "../../../../models/DTOs/fetch-detail-grid-forms-req-d-t.o";
import {FORM_KIND} from "../../../../constants/enums";

@Component({
  selector: 'app-base-form',
  template: `
    <ng-container #container></ng-container>
    <ng-container #detailContainer></ng-container>
  `,
  styles: []
})
export class BaseFormComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef

  @ViewChild('detailContainer', {read: ViewContainerRef})
  detailContainer: ViewContainerRef

  subscription: Subscription[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private baseInfoService: BaseInfoService
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.container.clear()
      this.detailContainer.clear()
      const form = this.activatedRoute.snapshot.data['data'];
      const comRef = this.container.createComponent(BaseInfoGridComponent)
      comRef.setInput('form', form)
      if (form.formKind.id === FORM_KIND.MASTER) {
        this.subscription.push(
          this.baseInfoService.fetchDetailGridForms(new FetchDetailGridFormsReqDTO(form.id)).subscribe(detailForms => {
            comRef.setInput('detailForms', detailForms)
            this.subscription.push(
              comRef.instance.onRowDoubleClicked.subscribe(masterId => {
                this.detailContainer.clear()
                detailForms.forEach(detailForm => {
                  const detailCompRef = this.detailContainer.createComponent(BaseInfoGridComponent)
                  detailCompRef.setInput('form', detailForm)
                  detailCompRef.setInput('masterId', masterId)
                  detailCompRef.setInput('class', 'mt-5')
                })
              })
            )
          })
        )
      }
      this.cdr.detectChanges()
    })
  }
}
