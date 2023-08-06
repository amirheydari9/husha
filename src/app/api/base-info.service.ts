import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";
import {FetchMenuReqDTO} from "../models/DTOs/fetch-menu-req.DTO";
import {HttpParams} from "@angular/common/http";
import {FetchFormDTO} from "../models/DTOs/fetch-form.DTO";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMenu(payload?: FetchMenuReqDTO): Promise<IMenuRes[]> {
    const params = new HttpParams()
      .set('cid', payload?.cid || '')
      .set('sid', payload?.sid || '')
      .set('pid', payload?.pid || '')
      .set('uid', payload?.uid || '');
    return this.httpService.get<IMenuRes[]>('baseinfo/menu/access-menu', params).toPromise()
  }

  fetchForm(payload: FetchFormDTO): Promise<IFetchFormRes> {
    return this.httpService.get<IFetchFormRes>(`baseinfo/form/getById/${payload.formId}`).toPromise()
  }

}
