import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {IMyCustomerRes} from "../../models/interface/my-customer-res.interface";
import {IGetCustomerUserCountRes} from "../../models/interface/get-customer-user-count-res.interface";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";
import {IGetPeriodRes} from "../../models/interface/get-period-res.interface";
import {IGetUnitsRes} from "../../models/interface/get-units-res.interface";

export interface CustomerStateModel {
  myCustomers: IMyCustomerRes[],
  customerUserCount: IGetCustomerUserCountRes,
  customerServices: IGetServicesRes[],
  customerPeriods: IGetPeriodRes[],
  customerUnits: IGetUnitsRes[],
}

export class FetchMyCustomersAction {
  static readonly type = '[CUTOMER] fetch customers';

  constructor(
    public payload: IMyCustomerRes[]
  ) {
  }
}

export class GetCustomerUserCountAction {
  static readonly type = '[CUTOMER] get customer user count';

  constructor(
    public payload: IGetCustomerUserCountRes
  ) {
  }
}

export class GetCustomerServicesAction {
  static readonly type = '[CUTOMER] get customer services';

  constructor(
    public payload: IGetServicesRes[]
  ) {
  }
}

export class GetCustomerPeroidsAction {
  static readonly type = '[CUTOMER] get customer periods';

  constructor(
    public payload: IGetPeriodRes[]
  ) {
  }
}

export class GetCustomerUnitsAction {
  static readonly type = '[CUTOMER] get customer units';

  constructor(
    public payload: IGetUnitsRes[]
  ) {
  }
}

@State<CustomerStateModel>({
  name: 'customer',
})

@Injectable()
export class CustomerState {

  @Selector()
  public static myCustomers(state: CustomerStateModel): IMyCustomerRes[] {
    return state.myCustomers
  }

  @Selector()
  public static customerUserCount(state: CustomerStateModel): IGetCustomerUserCountRes {
    return state.customerUserCount
  }

  @Selector()
  public static customerServices(state: CustomerStateModel): IGetServicesRes[] {
    return state.customerServices
  }

  @Selector()
  public static customerPeriods(state: CustomerStateModel): IGetPeriodRes[] {
    return state.customerPeriods
  }

  @Selector()
  public static customerUnits(state: CustomerStateModel): IGetUnitsRes[] {
    return state.customerUnits
  }

  @Action(FetchMyCustomersAction)
  fetchMenu(ctx: StateContext<CustomerStateModel>, action: FetchMyCustomersAction) {
    ctx.setState({...ctx.getState(), myCustomers: action.payload})
  }

  @Action(GetCustomerUserCountAction)
  getCustomerUserCount(ctx: StateContext<CustomerStateModel>, action: GetCustomerUserCountAction) {
    ctx.setState({...ctx.getState(), customerUserCount: action.payload})
  }

  @Action(GetCustomerServicesAction)
  getCustomerServices(ctx: StateContext<CustomerStateModel>, action: GetCustomerServicesAction) {
    ctx.setState({...ctx.getState(), customerServices: action.payload})
  }

  @Action(GetCustomerPeroidsAction)
  getCustomerPeriods(ctx: StateContext<CustomerStateModel>, action: GetCustomerPeroidsAction) {
    ctx.setState({...ctx.getState(), customerPeriods: action.payload})
  }

  @Action(GetCustomerUnitsAction)
  getCustomerUnits(ctx: StateContext<CustomerStateModel>, action: GetCustomerUnitsAction) {
    ctx.setState({...ctx.getState(), customerUnits: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([CustomerState])]
})
export class CustomerStore {
}
