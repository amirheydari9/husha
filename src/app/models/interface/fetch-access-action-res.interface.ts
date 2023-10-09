import {ACCESS_FORM_ACTION_TYPE} from "../../constants/enums";

export interface IFetchAccessActionRes {
  id: number;
  description: string;
  name: string;
  action: ACCESS_FORM_ACTION_TYPE;
}


