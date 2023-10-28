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
import {UpdateFormDataReqDTO} from "../models/DTOs/update-form-data-req.DTO";
import {FetchDetailGridFormsReqDTO} from "../models/DTOs/fetch-detail-grid-forms-req-d-t.o";

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
    return this.httpService.post<IFetchFormDataRes[]>(`baseinfo/data/all`, payload)
  }

  fetchFormData(payload: FetchFormDataByIdDTO): Observable<IFetchFormDataRes> {
    return this.httpService.post<IFetchFormDataRes>(`baseinfo/data/id`, payload)
  }

  accessFormAction(payload: FetchAccessActionDTO): Observable<IFetchAccessActionRes[]> {
    return this.httpService.get<IFetchAccessActionRes[]>(`baseinfo/apiFunction/${payload.cid}/${payload.sid}/${payload.uid}/${payload.formId}/accessFormActions`)
  }

  fetchTypeValues(payload: FetchTypeValuesDTO): Observable<IFetchTypeValuesRes[]> {
    return this.httpService.get<IFetchTypeValuesRes[]>(`baseinfo/typeValue/${payload.typeId}/getValues`)
  }

  fetchMaxIncValue(payload: FetchMaxIncValueByFieldNameDTO): Observable<number> {
    const params = this.httpService.toHttpParam(payload)
    // return of(1234)
    //TODO active
    return this.httpService.post<number>(`baseinfo/data/max-inc-value-by-field-name`,payload)
  }

  fetchAllSummary(payload: FetchAllFormDataDTO): Observable<IFetchAllSummaryRes[]> {
    return this.httpService.post<IFetchAllSummaryRes[]>(`baseinfo/data/summary`, payload)
  }

  addFormData(payload: AddFormDataReqDTO) {
    return this.httpService.post(`baseinfo/data`, payload)
  }

  updateFormData(payload: UpdateFormDataReqDTO) {
    return this.httpService.put(`baseinfo/data`, payload)
  }

  deleteFormData(payload: DeleteFormDataDTO): Observable<boolean> {
    // return of({"response": true, "error": null}).pipe(delay(1000))
    return this.httpService.delete<boolean>(`baseinfo/data`, payload)
  }

  fetchDetailGridForms(payload: FetchDetailGridFormsReqDTO): Observable<IFetchFormRes[]> {
    return this.httpService.get(`baseinfo/form/${payload.masterFormId}/getDetails`)
  }


}
