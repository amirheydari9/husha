import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {FetchFormDataDTO} from "../models/DTOs/fetch-form-data.DTO";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {Observable} from "rxjs";
import {FetchAccessActionDTO} from "../models/DTOs/fetch-access-action.DTO";
import {FetchTypeValuesDTO} from "../models/DTOs/fetch-type-values.DTO";
import {IFetchTypeValuesRes} from "../models/interface/fetch-type-values-res.interface";
import {IFetchAccessActionRes} from "../models/interface/fetch-access-action-res.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMenu(payload?: FetchMenuReqDTO): Promise<IMenuRes[]> {
    const params = this.httpService.toHttpParam(payload)
    return this.httpService.get<IMenuRes[]>('baseinfo/menu/access-menu', params).toPromise()
  }

  fetchForm(payload: FetchFormDTO): Observable<IFetchFormRes> {
    return this.httpService.get<IFetchFormRes>(`baseinfo/form/getById/${payload.formId}`)
  }

  getAllFormData(payload: FetchFormDataDTO): Observable<IFetchFormDataRes[]> {
    const params = this.httpService.toHttpParam(payload)
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    return this.httpService.get<IFetchFormDataRes[]>(`baseinfo/data`, params)
  }

  getFormDataById(payload: FetchFormDataDTO): Observable<IFetchFormDataRes> {
    const params = this.httpService.toHttpParam(payload)
    return this.httpService.get<IFetchFormDataRes>(`baseinfo/data/id`, params)
  }

  deleteFormData(payload: FetchFormDataDTO): Observable<boolean> {
    const params = this.httpService.toHttpParam(payload)
    // return of({"response": true, "error": null}).pipe(delay(1000))
    return this.httpService.delete<boolean>(`baseinfo/data`, params)
  }

  accessFormAction(payload: FetchAccessActionDTO): Observable<IFetchAccessActionRes[]> {
    return this.httpService.get<IFetchAccessActionRes[]>(`baseinfo/apiFunction/${payload.cid}/${payload.sid}/${payload.uid}/${payload.formId}/accessFormActions`)
  }

  fetchTypeValues(payload: FetchTypeValuesDTO): Observable<IFetchTypeValuesRes[]> {
    return this.httpService.get<IFetchTypeValuesRes[]>(`baseinfo/typeValue/${payload.typeId}/getValues`)
  }


}
