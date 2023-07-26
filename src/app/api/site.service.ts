import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {FetchAllShowReqDTO} from "../models/DTOs/fetch-all-show-req.DTO";
import {IFetchAllForShowRes} from "../models/interface/fetch-all-for-show-res.interface";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchAllForShow(payload: FetchAllShowReqDTO): Promise<IFetchAllForShowRes[]> {
    const params = new HttpParams().set('page', payload.page).set('size', payload.size)
    return this.httpService.get<IFetchAllForShowRes[]>('site/post/getAllForShow', params).toPromise()
  }
}
