import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {FetchAllFormDataDTO} from "../models/DTOs/fetch-all-form-data.DTO";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {Observable, of} from "rxjs";
import {FetchAccessActionDTO} from "../models/DTOs/fetch-access-action.DTO";
import {FetchTypeValuesDTO} from "../models/DTOs/fetch-type-values.DTO";
import {IFetchTypeValuesRes} from "../models/interface/fetch-type-values-res.interface";
import {IFetchAccessActionRes} from "../models/interface/fetch-access-action-res.interface";
import {FetchFormDataByIdDTO} from "../models/DTOs/fetch-form-data-by-id.DTO";
import {DeleteFormDataDTO} from "../models/DTOs/delete-form-data.DTO";
import {FetchMaxIncValueByFieldNameDTO} from "../models/DTOs/fetch-max-inc-value-by-field-name.DTO";
import {IFetchAllSummaryRes} from "../models/interface/fetch-all-summary-res.interface";
import {AddFormDataReqDTO} from "../models/DTOs/add-form-data-req.DTO";
import {HttpHeaders} from "@angular/common/http";
import {UpdateFormDataReqDTO} from "../models/DTOs/update-form-data-req.DTO";
import {FetchDetailGridFormReqDTO} from "../models/DTOs/fetch-detail-grid-form-req-d-t.o";

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

  fetchAllFormData(payload: FetchAllFormDataDTO): Observable<IFetchFormDataRes[]> {
    const params = this.httpService.toHttpParam(payload)
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    return this.httpService.get<IFetchFormDataRes[]>(`baseinfo/data`, params)
  }

  fetchFormData(payload: FetchFormDataByIdDTO): Observable<IFetchFormDataRes> {
    const params = this.httpService.toHttpParam(payload)
    return this.httpService.get<IFetchFormDataRes>(`baseinfo/data/id`, params)
  }

  deleteFormData(payload: DeleteFormDataDTO): Observable<boolean> {
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

  fetchMaxIncValue(payload: FetchMaxIncValueByFieldNameDTO): Observable<any> {
    const params = this.httpService.toHttpParam(payload)
    return of(1234)
    //TODO 404
    // return this.httpService.get<any>(`baseinfo/data/max_inc-value-by-field-name`,params)
  }

  fetchAllSummary(payload: FetchAllFormDataDTO): Observable<IFetchAllSummaryRes[]> {
    const params = this.httpService.toHttpParam(payload)
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    return this.httpService.get<IFetchAllSummaryRes[]>(`baseinfo/data/summary`, params)
  }

  addFormData(payload: AddFormDataReqDTO, model: any) {
    const params = this.httpService.toHttpParam(payload)
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.httpService.post(`baseinfo/data`, model, params, headers)
  }

  updateFormData(payload: UpdateFormDataReqDTO, model: any) {
    const params = this.httpService.toHttpParam(payload)
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.httpService.put(`baseinfo/data`, model, params, headers)
  }

  fetchDetailGrid(payload: FetchDetailGridFormReqDTO): Observable<IFetchFormRes[]> {
    return this.httpService.get(`baseinfo/form/${payload.masterFormId}/getDetails`)
  }


}
