import {CRITERIA_OPERATION_TYPE, DOWNLOAD_TYPE} from "../../constants/enums";

export interface criteriaInterface {
  key: string;
  operation: CRITERIA_OPERATION_TYPE,
  value: string
}


export class FetchAllFormDataDTO {
  constructor(
    public cid: number,
    public formId: number,
    public formKind: number,
    public sid: number,
    public uid: number,
    public pid: number,
    public serialId?: number,
    public page?: number,
    public size?: number,
    public sort?: string,
    public parentId?: number,
    public masterId?: number,
    public criteria?: criteriaInterface[],
    public downloadType?: DOWNLOAD_TYPE,
    public resultSet?: string
  ) {
  }
}
