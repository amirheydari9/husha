import {Injectable} from '@angular/core';
import {HttpService} from "../utils/http.service";
import {IMyCustomerRes} from "../models/interface/my-customer-res.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private httpService: HttpService
  ) {
  }

  fetchMyCustomers():Promise<IMyCustomerRes[]>{
    return this.httpService.get<IMyCustomerRes[]>('customer/my-customers').toPromise()
  }

}
