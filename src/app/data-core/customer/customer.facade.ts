import {Injectable} from '@angular/core';
import {Select} from "@ngxs/store";
import {CustomerState, FetchMyCustomersAction} from "./customer.store";
import {Observable} from "rxjs";
import {CustomerService} from "../../api/customer.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IMyCustomerRes} from "../../models/interface/my-customer-res.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerFacade {

  constructor(
    private customerService: CustomerService,
  ) {
  }

  @Select(CustomerState.myCustomers) myCustomers$: Observable<IMyCustomerRes[]>

  @Dispatch()
  async fetchMyCustomers() {
    const data = await this.customerService.fetchMyCustomers()
    return new FetchMyCustomersAction(data)
  }

}
