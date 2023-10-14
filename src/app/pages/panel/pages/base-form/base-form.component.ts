import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {BaseInfoGridComponent} from "../../../../components/base-info-grid/base-info-grid.component";

@Component({
  selector: 'app-base-form',
  template: `
    <ng-container #container></ng-container>
    <div class="mt-3">
      <ng-container #detailContainer></ng-container>
    </div>
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
    private cdr: ChangeDetectorRef
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
      this.subscription.push(
        comRef.instance.onDbClick.subscribe(masterId => {
          this.detailContainer.clear()
          const detailCompRef = this.detailContainer.createComponent(BaseInfoGridComponent)
          detailCompRef.setInput('form', form)
          detailCompRef.setInput('masterId', masterId)
        })
      )
      this.cdr.detectChanges()
    })
  }


}
