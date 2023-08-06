import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

  subscription: Subscription[] = []

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscription.push(
      this.route.params.subscribe(data => {
        console.log(data)
      })
    )
  }

}
