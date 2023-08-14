import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {IMenuRes} from "../../models/interface/menu-res.interface";
import {IFetchFormRes} from "../../models/interface/fetch-form-res.interface";
import {IFetchFormDataRes} from "../../models/interface/fetch-form-data-res.interface";

export interface BaseInfoStateModel {
  menu: IMenuRes[],
  form: IFetchFormRes,
  formData: IFetchFormDataRes
}

export class FetchMenuAction {
  static readonly type = '[BASE_INFO] fetch menu';

  constructor(
    public payload: IMenuRes[]
  ) {
  }
}

export class FetchFormAction {
  static readonly type = '[BASE_INFO] fetch form';

  constructor(
    public payload: IFetchFormRes
  ) {
  }
}

export class FetchFormDataAction {
  static readonly type = '[BASE_INFO] fetch form data';

  constructor(
    public payload: IFetchFormDataRes
  ) {
  }
}

@State<BaseInfoStateModel>({
  name: 'baseInfo',
  defaults: {
    menu: [],
    form: null,
    formData: null
  }
})

@Injectable()
export class BaseInfoState {

  @Selector()
  public static menu(state: BaseInfoStateModel): IMenuRes[] {
    return state.menu
  }

  @Selector()
  public static form(state: BaseInfoStateModel): IFetchFormRes {
    return state.form
  }

  @Selector()
  public static formData(state: BaseInfoStateModel): IFetchFormDataRes {
    return state.formData
  }

  @Action(FetchMenuAction)
  fetchMenu(ctx: StateContext<BaseInfoStateModel>, action: FetchMenuAction) {
    ctx.setState({...ctx.getState(), menu: action.payload})
  }

  @Action(FetchFormAction)
  fetchForm(ctx: StateContext<BaseInfoStateModel>, action: FetchFormAction) {
    ctx.setState({...ctx.getState(), form: action.payload})
  }

  @Action(FetchFormDataAction)
  fetchFormData(ctx: StateContext<BaseInfoStateModel>, action: FetchFormDataAction) {
    ctx.setState({...ctx.getState(), formData: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([BaseInfoState])]
})
export class BaseInfoStore {
}
