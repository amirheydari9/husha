import {Injectable} from '@angular/core';
import {Select} from "@ngxs/store";
import {
  CustomerState,
  FetchMyCustomersAction, GetCustomerPeroidsAction,
  GetCustomerServicesAction, GetCustomerUnitsAction,
  GetCustomerUserCountAction
} from "./customer.store";
import {Observable} from "rxjs";
import {CustomerService} from "../../api/customer.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IMyCustomerRes} from "../../models/interface/my-customer-res.interface";
import {GetCustomerUserCountReqDTO} from "../../models/DTOs/get-customer-user-count-req.DTO";
import {IGetCustomerUserCountRes} from "../../models/interface/get-customer-user-count-res.interface";
import {GetServicesReqDTO} from "../../models/DTOs/get-services-req.DTO";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";
import {GetPeriodReqDTO} from "../../models/DTOs/get-period-req.DTO";
import {GetUnitsReqDTO} from "../../models/DTOs/get-units-req.DTO";
import {IGetPeriodRes} from "../../models/interface/get-period-res.interface";
import {IGetUnitsRes} from "../../models/interface/get-units-res.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerFacade {

  constructor(
    private customerService: CustomerService,
  ) {
  }

  @Select(CustomerState.myCustomers) myCustomers$: Observable<IMyCustomerRes[]>
  @Select(CustomerState.customerUserCount) customerUserCount$: Observable<IGetCustomerUserCountRes>
  @Select(CustomerState.customerServices) customerServices$: Observable<IGetServicesRes[]>
  @Select(CustomerState.customerPeriods) customerPeriods$: Observable<IGetPeriodRes[]>
  @Select(CustomerState.customerUnits) customerUnits$: Observable<IGetUnitsRes[]>

  @Dispatch()
  async fetchMyCustomers() {
    const data = await this.customerService.fetchMyCustomers()
    return new FetchMyCustomersAction(data)
  }

  @Dispatch()
  async getCustomerUserCount(payload: GetCustomerUserCountReqDTO) {
    const data = await this.customerService.getCustomerUserCount(payload)
    return new GetCustomerUserCountAction(data)
  }

  @Dispatch()
  async getCustomerServices(payload: GetServicesReqDTO) {
    const data = await this.customerService.getServices(payload)
    return new GetCustomerServicesAction(data)
  }

  @Dispatch()
  async getCustomerPeriods(payload: GetPeriodReqDTO) {
    const data = await this.customerService.getPeriod(payload)
    return new GetCustomerPeroidsAction(data)
  }

  @Dispatch()
  async getCustomerUnits(payload: GetUnitsReqDTO) {
    const data = await this.customerService.getUnits(payload)
    return new GetCustomerUnitsAction(data)
  }

}
