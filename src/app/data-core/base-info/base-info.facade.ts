import {Injectable} from '@angular/core';
import {Select} from "@ngxs/store";
import {BaseInfoState, FetchFormAction, FetchFormDataAction, FetchMenuAction} from "./base-info.store";
import {Observable} from "rxjs";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {BaseInfoService} from "../../api/base-info.service";
import {IMenuRes} from "../../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../../models/DTOs/fetch-menu-req.DTO";
import {FetchFormDTO} from "../../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {FetchFormDataDTO} from "../../models/DTOs/fetch-form-data.DTO";
import {IFetchFormDataRes} from "../../models/interface/fetch-form-data-res.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoFacade {

  constructor(
    private baseInfoService: BaseInfoService,
  ) {
  }

  @Select(BaseInfoState.menu) menu$: Observable<IMenuRes[]>
  // @Select(BaseInfoState.form) form$: Observable<IFetchFormRes>
  // @Select(BaseInfoState.formData) formData$: Observable<IFetchFormDataRes>

  @Dispatch()
  async fetchMenu(payload: FetchMenuReqDTO) {
    const data = await this.baseInfoService.fetchMenu(payload)
    return new FetchMenuAction(data)
  }

  @Dispatch()
  async fetchForm(payload: FetchFormDTO) {
    const data = await this.baseInfoService.fetchForm(payload)
    // return new FetchFormAction(data)
  }

  @Dispatch()
  async fetchFormData(payload: FetchFormDataDTO) {
    const data = await this.baseInfoService.fetchFormData(payload)
    // return new FetchFormDataAction(data)
  }


}
