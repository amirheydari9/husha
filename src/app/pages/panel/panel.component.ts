import {Component, OnInit} from '@angular/core';
import {BaseInfoFacade} from "../../data-core/base-info/base-info.facade";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {


  constructor(
    private baseInfoFacade: BaseInfoFacade
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.baseInfoFacade.fetcMenu()
    } catch (e) {
      console.log(e)
    }
  }
}
