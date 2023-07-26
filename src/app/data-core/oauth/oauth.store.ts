import {Injectable, NgModule} from '@angular/core';
import {Action, NgxsModule, Selector, State, StateContext} from '@ngxs/store';
import {ICaptchaRes} from "../../models/interface/captcha-res.interface";
import {IUserAvatarRes} from "../../models/interface/user-avatar-res.interface";
import {IUserSettingRes} from "../../models/interface/user-setting-res.interface";

export interface OauthStateModel {
  captcha: ICaptchaRes,
  userAvatar: IUserAvatarRes,
  userSetting: IUserSettingRes
}

export class FetchCaptchaAction {
  static readonly type = '[OAUTH] fetch captcha';

  constructor(
    public payload: ICaptchaRes
  ) {
  }
}

export class FetchUserAvatarAction {
  static readonly type = '[OAUTH] fetch user avatar';

  constructor(
    public payload: IUserAvatarRes
  ) {
  }
}

export class FetchUserSettingAction {
  static readonly type = '[OAUTH] fetch user setting';

  constructor(
    public payload: IUserSettingRes
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

  @Selector()
  public static userAvatar(state: OauthStateModel): IUserAvatarRes {
    return state.userAvatar
  }

  @Selector()
  public static userSettinfg(state: OauthStateModel): IUserSettingRes {
    return state.userSetting
  }

  @Action(FetchCaptchaAction)
  fetchCaptcha(ctx: StateContext<OauthStateModel>, action: FetchCaptchaAction) {
    ctx.setState({...ctx.getState(), captcha: action.payload})
  }

  @Action(FetchUserAvatarAction)
  fetchUserAvatar(ctx: StateContext<OauthStateModel>, action: FetchUserAvatarAction) {
    ctx.setState({...ctx.getState(), userAvatar: action.payload})
  }

  @Action(FetchUserSettingAction)
  fetchUserSetting(ctx: StateContext<OauthStateModel>, action: FetchUserSettingAction) {
    ctx.setState({...ctx.getState(), userSetting: action.payload})
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([OauthState])]
})
export class OauthStore {
}
