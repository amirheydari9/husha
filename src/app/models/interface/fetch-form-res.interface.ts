import {
  FORM_KIND,
  INPUT_FIELD_TYPE,
  INSERT_TYPE,
  LOOKUP_VIEW_TYPE,
  SERIAL_TYPE,
  VIEW_TYPE
} from "../../constants/enums";

export interface IFormField {
  id: number,
  fieldType: { id: number, title: string, isActive: boolean, dataType: INPUT_FIELD_TYPE },
  caption: string,
  name: string,
  editable: boolean,
  priority: number,
  notNullable: boolean,
  isId: boolean,
  isAuto: boolean,
  unique: boolean,
  minSize: number,
  maxSize: number,
  lookUpForm:number,
  lookUpType: { id: number, title: string, systemDefine: number, isActive: boolean, engTitle: string },
  isActive: boolean,
  viewType: VIEW_TYPE,
  defaultValue: any,
  canUnselect: boolean,
  // groupCode
  lookUpViewType: LOOKUP_VIEW_TYPE,
  lookupCaptionCode: string,
  lookupCaptionTitle: string,
  // typeValue
  isDetail: boolean,
  detailOrder: number,
  hasMasterFilter: boolean,
  lookUpIsMultilevel: boolean,
  hasGlobalSearch: boolean,
  // setMaxId:?
  entryType: { id: number, title: string, systemDefine: number, typeValueId: number, isActive: boolean, isDefault: boolean, engTitle: string }
}

export interface IFetchFormRes {
  id: number,
  title: string,
  formKind: {
    id: FORM_KIND,
    isActive: boolean,
    title: string
  },
  hasFormImport: boolean,
  insertType: INSERT_TYPE,
  priority: number,
  havePeriod: boolean,
  isDetail: boolean,
  detailPriority: number,
  isActive: boolean,
  serialType: SERIAL_TYPE,
  fields: IFormField[],
}

// serialType
// systemDefine
// typeValueId
// viewType
// INSERT_TYPE
// INPUT_DATA_TYPE
// lookUpViewType
