import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {FetchFormDataDTO} from "../models/DTOs/fetch-form-data.DTO";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {delay, Observable, of, timeout} from "rxjs";
import {HttpHeaders} from "@angular/common/http";

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

  fetchFormData(payload: FetchFormDataDTO): Observable<IFetchFormDataRes[]> {
    const params = this.httpService.toHttpParam(payload)
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    return this.httpService.get<IFetchFormDataRes[]>(`baseinfo/data`, params)
  }

  deleteFormData(payload: FetchFormDataDTO): Observable<any> {
    const params = this.httpService.toHttpParam(payload)
    // return of({"response": true, "error": null}).pipe(delay(1000))
    return this.httpService.delete<IFetchFormDataRes[]>(`baseinfo/data`, params)
  }
}
