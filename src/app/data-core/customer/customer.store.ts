import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {IMyCustomerRes} from "../../models/interface/my-customer-res.interface";

export interface CustomerStateModel {
  myCustomers: IMyCustomerRes[]
}

export class FetchMyCustomersAction {
  static readonly type = '[CUTOMER] fetch customers';

  constructor(
    public payload: IMyCustomerRes[]
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

  @Action(FetchMyCustomersAction)
  fetchMenu(ctx: StateContext<CustomerStateModel>, action: FetchMyCustomersAction) {
    ctx.setState({...ctx.getState(), myCustomers: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([CustomerState])]
})
export class CustomerStore {
}
