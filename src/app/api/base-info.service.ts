import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {FetchAllFormDataDTO} from "../models/DTOs/fetch-all-form-data.DTO";
import {Observable} from "rxjs";
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
import {AddListFormDataReqDTO} from "../models/DTOs/add-list-form-data-req.DTO";
import {SignReqDTO} from "../models/DTOs/sign-req.DTO";
import {AttachmentReqDTO} from "../models/DTOs/attachment-req.DTO";
import {AttachmentRes} from "../models/interface/attachment-res.interface";

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

  fetchAllFormData(payload: FetchAllFormDataDTO): Observable<any[]> {
    return this.httpService.post<any[]>(`baseinfo/data/all`, payload)
  }

  fetchFormData(payload: FetchFormDataByIdDTO): Observable<any> {
    return this.httpService.post<any>(`baseinfo/data/id`, payload)
  }

  accessFormAction(payload: FetchAccessActionDTO): Observable<IFetchAccessActionRes[]> {
    return this.httpService.get<IFetchAccessActionRes[]>(`baseinfo/apiFunction/${payload.cid}/${payload.sid}/${payload.uid}/${payload.formId}/accessFormActions`)
  }

  fetchTypeValues(payload: FetchTypeValuesDTO): Observable<IFetchTypeValuesRes[]> {
    return this.httpService.get<IFetchTypeValuesRes[]>(`baseinfo/typeValue/${payload.typeId}/getValues`)
  }

  fetchMaxIncValue(payload: FetchMaxIncValueByFieldNameDTO): Observable<number> {
    return this.httpService.post<number>(`baseinfo/data/max-inc-value-by-field-name`, payload)
  }

  fetchAllSummary(payload: FetchAllFormDataDTO): Observable<IFetchAllSummaryRes[]> {
    return this.httpService.post<IFetchAllSummaryRes[]>(`baseinfo/data/summary`, payload)
  }

  addFormData(payload: AddFormDataReqDTO) {
    return this.httpService.post(`baseinfo/data`, payload, null, this.httpService.showNotificationHeader())
  }

  addListFormData(payload: AddListFormDataReqDTO) {
    return this.httpService.post(`baseinfo/data/list`, payload, null, this.httpService.showNotificationHeader())
  }

  updateFormData(payload: UpdateFormDataReqDTO) {
    return this.httpService.put(`baseinfo/data`, payload)
  }

  deleteFormData(payload: DeleteFormDataDTO): Observable<boolean> {
    return this.httpService.delete<boolean>(`baseinfo/data`, payload)
  }

  fetchDetailGridForms(payload: FetchDetailGridFormsReqDTO): Observable<IFetchFormRes[]> {
    return this.httpService.get(`baseinfo/form/${payload.masterFormId}/getDetails`)
  }

  //TODO صحبت با آقای عبدالهی در مورد position و signNumber
  sign(payload: SignReqDTO) {
    return this.httpService.put(`baseinfo/signing/sign`, payload)
  }

  returnSign(payload: SignReqDTO) {
    return this.httpService.put(`baseinfo/signing/return-sign`, payload)
  }

  getAllAttachments(payload: AttachmentReqDTO): Observable<AttachmentRes[]> {
    return this.httpService.post(`baseinfo/attachment/all`, payload)
  }

  addAttachment(payload: AttachmentReqDTO): Observable<AttachmentRes> {
    return this.httpService.post(`baseinfo/attachment/add`, payload, null, this.httpService.showNotificationHeader())
  }

  updateAttachment(payload: AttachmentReqDTO): Observable<AttachmentRes> {
    return this.httpService.put(`baseinfo/attachment`, payload)
  }

  removeAttachment(payload: AttachmentReqDTO): Observable<boolean> {
    return this.httpService.delete(`baseinfo/attachment`, payload)
  }

  removeAllAttachment(payload: AttachmentReqDTO): Observable<boolean> {
    return this.httpService.delete(`baseinfo/attachment/remove-all`, payload)
  }


}
