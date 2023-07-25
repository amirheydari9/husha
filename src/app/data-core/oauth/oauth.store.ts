import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {ICaptchaRes} from "../../models/interface/captcha-res.interface";

export interface OauthStateModel {
  captcha: ICaptchaRes
}

export class FetchCaptchaAction {
  static readonly type = '[OAUTH] fetch captcha';

  constructor(
    public payload: ICaptchaRes
  ) {
  }
}

@State<OauthStateModel>({
  name: 'oauth',
})

@Injectable()
export class OauthState {

  @Selector()
  public static captcha(state: OauthStateModel): ICaptchaRes {
    return state.captcha
  }

  @Action(FetchCaptchaAction)
  fetchCaptcha(ctx: StateContext<OauthStateModel>, action: FetchCaptchaAction) {
    ctx.setState({...ctx.getState(), captcha: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([OauthState])]
})
export class OauthStore {
}
