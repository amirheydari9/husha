import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {IMenuRes} from "../../models/interface/menu-res.interface";

export interface BaseInfoStateModel {
  menu: IMenuRes[]
}

export class FetchMenuAction {
  static readonly type = '[BASE_INFO] fetch menu';

  constructor(
    public payload: IMenuRes[]
  ) {
  }
}

@State<BaseInfoStateModel>({
  name: 'baseInfo',
  defaults: {
    menu: []
  }
})

@Injectable()
export class BaseInfoState {

  @Selector()
  public static menu(state: BaseInfoStateModel): IMenuRes[] {
    return state.menu
  }

  @Action(FetchMenuAction)
  fetchMenu(ctx: StateContext<BaseInfoStateModel>, action: FetchMenuAction) {
    ctx.setState({...ctx.getState(), menu: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([BaseInfoState])]
})
export class BaseInfoStore {
}
