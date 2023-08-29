import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {HttpParams} from "@angular/common/http";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {FetchFormDataDTO} from "../models/DTOs/fetch-form-data.DTO";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMenu(payload?: FetchMenuReqDTO): Promise<IMenuRes[]> {
    let params = new HttpParams()
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        params = params.set(key, payload[key] || '');
      }
    }
    return this.httpService.get<IMenuRes[]>('baseinfo/menu/access-menu', params).toPromise()
  }

  fetchForm(payload: FetchFormDTO): Observable<IFetchFormRes> {
    return this.httpService.get<IFetchFormRes>(`baseinfo/form/getById/${payload.formId}`)
  }

  fetchFormData(payload: FetchFormDataDTO): Observable<IFetchFormDataRes[]> {
    let params = new HttpParams()
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        params = params.set(key, payload[key] !== null ? payload[key] : '');
      }
    }
    return this.httpService.get<IFetchFormDataRes[]>(`baseinfo/data`, params)
  }
}
