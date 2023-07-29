import {Component, OnInit} from '@angular/core';
import {OauthFacade} from "../../data-core/oauth/oauth.facade";
import {SiteFacade} from "../../data-core/site/site.facade";
import {FetchAllShowReqDTO} from "../../models/DTOs/fetch-all-show-req.DTO";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {

  constructor(
    private oauthFacade: OauthFacade,
    private siteFacade: SiteFacade
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        this.oauthFacade.fetchUserSetting(),
        this.siteFacade.fetchAllForShow(new FetchAllShowReqDTO(0, 100))
      ])
    } catch (e) {
      console.log(e)
    }
  }
}
