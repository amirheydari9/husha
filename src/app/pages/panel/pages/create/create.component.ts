import {Component, OnInit} from '@angular/core';
import {dynamicField} from "../../../../components/dynamic-form/dynamic-form.component";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  subscription: Subscription [] = []
  model: dynamicField[][] = []

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

  ngOnInit(): void {
    this.subscription.push(
      this.activatedRoute.params.subscribe(() => {
        this.model = this.hushaFormUtilService.createModel(this.activatedRoute.snapshot.data['data'].fields)
      })
    )
  }
}
