import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {IFetchAllForShowRes} from "../../models/interface/fetch-all-for-show-res.interface";

export interface SiteStateModel {
  data: IFetchAllForShowRes[]
}

export class FetchAllForShowAction {
  static readonly type = '[SITE] fetch all for show';

  constructor(
    public payload: IFetchAllForShowRes[]
  ) {
  }
}

@State<SiteStateModel>({
  name: 'site',
})

@Injectable()
export class SiteState {

  @Selector()
  public static data(state: SiteStateModel): IFetchAllForShowRes[] {
    return state.data
  }

  @Action(FetchAllForShowAction)
  fetchMenu(ctx: StateContext<SiteStateModel>, action: FetchAllForShowAction) {
    ctx.setState({...ctx.getState(), data: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([SiteState])]
})
export class SiteStore {
}
