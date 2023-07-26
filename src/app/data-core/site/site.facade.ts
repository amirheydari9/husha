import {Injectable} from '@angular/core';
import {Select} from "@ngxs/store";
import {FetchAllForShowAction, SiteState} from "./site.store";
import {Observable} from "rxjs";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {SiteService} from "../../api/site.service";
import {FetchAllShowReqDTO} from "../../models/DTOs/fetch-all-show-req.DTO";
import {IFetchAllForShowRes} from "../../models/interface/fetch-all-for-show-res.interface";

@Injectable({
  providedIn: 'root'
})
export class SiteFacade {

  constructor(
    private siteService: SiteService,
  ) {
  }

  @Select(SiteState.data) fetchAllForShow$: Observable<IFetchAllForShowRes[]>

  @Dispatch()
  async fetchAllForShow(payload: FetchAllShowReqDTO) {
    const data = await this.siteService.fetchAllForShow(payload)
    return new FetchAllForShowAction(data)
  }

}
