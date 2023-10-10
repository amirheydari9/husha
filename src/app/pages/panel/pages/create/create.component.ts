import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  subscription: Subscription [] = []

  @ViewChild('containerRef', {read: ViewContainerRef, static: true}) containerRef: ViewContainerRef
  @ViewChild('templateRef', {read: TemplateRef, static: true}) templateRef: TemplateRef<any>

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

  async ngOnInit(): Promise<void> {
    this.subscription.push(
      this.activatedRoute.params.subscribe(async params => {
        this.containerRef.clear();
        try {
          const model = await this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data']);
          const tempRef = this.templateRef.createEmbeddedView({context: model});
          this.containerRef.insert(tempRef);
        } catch (e) {
          console.log(e)
        }
      })
    )
  }
}
