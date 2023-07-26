import {Component, OnInit} from '@angular/core';
import {BaseInfoFacade} from "../../data-core/base-info/base-info.facade";
import {OauthFacade} from "../../data-core/oauth/oauth.facade";
import {CustomerFacade} from "../../data-core/customer/customer.facade";
import {SiteFacade} from "../../data-core/site/site.facade";
import {FetchAllShowReqDTO} from "../../models/DTOs/fetch-all-show-req.DTO";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {

  constructor(
    private baseInfoFacade: BaseInfoFacade,
    private oauthFacade: OauthFacade,
    private customerFacade: CustomerFacade,
    private siteFacade: SiteFacade
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        this.baseInfoFacade.fetcMenu(),
        this.oauthFacade.fetchUserAvatar(),
        this.oauthFacade.fetchUserSetting(),
        this.customerFacade.fetchMyCustomers(),
        this.siteFacade.fetchAllForShow(new FetchAllShowReqDTO(0,100))
      ])
    } catch (e) {
      console.log(e)
    }
  }
}
