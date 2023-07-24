import {GRANT_TYPES} from "../../constants/enums";

export class LoginReqDto {
  constructor(
    public username: string,
    public password: string,
    public captchaAnswer: number,
    public captchaId: string,
    public grant_type: GRANT_TYPES,
  ) {
  }
}
