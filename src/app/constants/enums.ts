export enum GRANT_TYPES {
  PASSWORD_CAPTCHA = "password_captcha",
  REFRESH_TOKEN = "refresh_token",
  PASSWORD = "password",
}

//TODO انواع اکشن ها چیست ؟  , get به چه دردی میخوره
export enum ACCESS_FORM_ACTION_TYPE {
  ADD = 'add',
  GET = 'get',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum FORM_KIND {
  MULTI_LEVEL = 1,
  MASTER = 2,
  DETAIL = 3,
  FLAT = 7,
}

export enum SERIAL_TYPE {

}

export enum INPUT_FIELD_TYPE {
  TEXT = 1,
  NUMBER = 2,
  FLOAT = 3,
  SWITCH = 4,
  GEORGIAN_DATE_PICKER = 5,
  JALALI_DATE_PICKER = 6,
  TEXT_AREA = 8,
  IMAGE = 9,
  FILE = 10,
  NUMBER_WITH_HINT = 11,
  URL = 12,
  EMAIL = 13,
  DROP_DOWN = 14,
  LOOK_UP_WITH_FORM = 15,
  GEORGIAN_DATE_PICKER_WITH_TIME = 18,
  JALALI_DATE_PICKER_WITH_TIME = 19,
  CURRENCY = 21
}

export enum INSERT_TYPE {

}

export enum VIEW_TYPE {
  NOT_SHOW = 0,
  SHOW_IN_GRID = 1,
  SHOW_IN_GRID_AND_FORM = 2,
  SHOW_IN_FORM = 3,
}

export enum LOOKUP_VIEW_TYPE {

}

export enum CRITERIA_OPERATION_TYPE {
  EQUAL = "EQUAL",
  LIKE = "LIKE",
  CONTAINS = "CONTAINS",
  START_WITH = "START_WITH",
  END_WITH = "END_WITH",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  NOT_NULL = "NOT_NULL",
  NULL = "NULL",
  EMPTY = "EMPTY",
  NOT_EMPTY = "NOT_EMPTY",
  IN = "IN"
}
