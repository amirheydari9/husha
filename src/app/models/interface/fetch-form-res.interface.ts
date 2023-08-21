import {FORM_KIND, INPUT_DATA_TYPE, INSERT_TYPE} from "../../constants/enums";

export interface IFetchFormRes {
  id: number,
  formKind: {
    id: FORM_KIND,
    isActive: boolean,
    title: string
  },
  hasFormImport: boolean,
  insertType: INSERT_TYPE,
  title: string,
  isActive: boolean,
  fields: {
    caption: string,
    defaultValue: any,
    fieldType: { id: number, title: string, isActive: boolean, dataType: INPUT_DATA_TYPE },
    isActive: boolean,
    notNullable: boolean,
    minSize: number,
    maxSize: number,
    name: string
  }[]
}
