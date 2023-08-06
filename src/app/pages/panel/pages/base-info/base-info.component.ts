import {Component, OnInit} from '@angular/core';
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {BaseInfoFacade} from "../../../../data-core/base-info/base-info.facade";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

  subscription: Subscription[] = []

  constructor(
    private baseInfoFacade: BaseInfoFacade
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.subscription.push(
      this.baseInfoFacade.form$.subscribe(data => {

      })
    )
  }

}
