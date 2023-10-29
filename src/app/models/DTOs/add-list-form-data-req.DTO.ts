export class AddListFormDataReqDTO {
  constructor(
    public formId: number,
    public formKind: number,
    public models: any[],
    public cid?: number,
    public serialId?: number,
    public sid?: number,
    public uid?: number,
    public pid?: number,
    public masterId?: number,
  ) {
  }
}
