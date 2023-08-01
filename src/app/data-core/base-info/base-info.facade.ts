import {Injectable} from '@angular/core';
import {Select} from "@ngxs/store";
import {BaseInfoState, FetchMenuAction} from "./base-info.store";
import {Observable} from "rxjs";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {BaseInfoService} from "../../api/base-info.service";
import {IMenuRes} from "../../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../../models/DTOs/fetch-menu-req.DTO";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoFacade {

  constructor(
    private baseInfoService: BaseInfoService,
  ) {
  }

  @Select(BaseInfoState.menu) menu$: Observable<IMenuRes[]>

  @Dispatch()
  async fetchMenu(payload?:FetchMenuReqDTO) {
    const data = await this.baseInfoService.fetchMenu(payload)
    return new FetchMenuAction(data)
  }

}
