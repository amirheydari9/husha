import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {DynamicFormComponent} from "../../../../components/dynamic-form/dynamic-form.component";

@Component({
  selector: 'app-create',
  template: `
    <ng-container #containerRef></ng-container>`,
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements AfterViewInit {

  subscription: Subscription [] = []

  @ViewChild('containerRef', {read: ViewContainerRef}) containerRef: ViewContainerRef

  // data = [
  //   {order: 0, name: 'ali', age: 20},
  //   {order: 0, name: 'amir', age: 20},
  //   {order: 1, name: 'saeed', age: null},
  //   {order: 2, name: 'reza', age: 10},
  //   {order: 2, name: 'reza1', age: 10},
  //   {order: 2, name: 'reza2', age: 10},
  //   {order: 2, name: 'reza3', age: 10},
  //   {order: 2, name: 'reza4', age: 10},
  //   {order: 2, name: 'reza5', age: 10},
  // ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService
  ) {
  }

  async ngAfterViewInit(): Promise<void> {
    this.subscription.push(
      this.activatedRoute.params.subscribe(async params => {
        this.containerRef.clear();
        try {
          const model = await this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data']);
          const comRef = this.containerRef.createComponent(DynamicFormComponent)
          comRef.setInput('model', model)
        } catch (e) {
          console.log(e)
        }
      })
    )
  }
}
