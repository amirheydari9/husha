import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMenuRes} from "../models/interface/menu-res.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseInfoService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMenu(): Promise<IMenuRes> {
    return this.httpService.get<IMenuRes>('baseinfo/menu/access-menu').toPromise()
  }

}
