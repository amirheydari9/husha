import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMyCustomerRes} from "../models/interface/my-customer-res.interface";
import {IGetCustomerUserCountRes} from "../models/interface/get-customer-user-count-res.interface";
import {GetCustomerUserCountReqDTO} from "../models/DTOs/get-customer-user-count-req.DTO";
import {GetServicesReqDTO} from "../models/DTOs/get-services-req.DTO";
import {IGetServicesRes} from "../models/interface/get-services-res.interface";
import {GetPeriodReqDTO} from "../models/DTOs/get-period-req.DTO";
import {IGetPeriodRes} from "../models/interface/get-period-res.interface";
import {GetUnitsReqDTO} from "../models/DTOs/get-units-req.DTO";
import {IGetUnitsRes} from "../models/interface/get-units-res.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMyCustomers(): Promise<IMyCustomerRes[]> {
    return this.httpService.get<IMyCustomerRes[]>('customer/my-customers').toPromise()
  }

  getCustomerUserCount(payload: GetCustomerUserCountReqDTO): Promise<IGetCustomerUserCountRes> {
    return this.httpService.get<IGetCustomerUserCountRes>(`customer/${payload.customerId}/userManager/getCustomerUsersCount`).toPromise()
  }

  getServices(payload: GetServicesReqDTO): Promise<IGetServicesRes[]> {
    return this.httpService.get<IGetServicesRes[]>(`customer/${payload.customerId}/services`).toPromise()
  }

  getPeriod(payload: GetPeriodReqDTO): Promise<IGetPeriodRes[]> {
    return this.httpService.get<IGetPeriodRes[]>(`customer/period/${payload.customerId}`).toPromise()
  }

  getUnits(payload: GetUnitsReqDTO): Promise<IGetUnitsRes[]> {
    return this.httpService.get<IGetUnitsRes[]>(`customer/${payload.customerId}/service/${payload.serviceId}/units`).toPromise()
  }
}
