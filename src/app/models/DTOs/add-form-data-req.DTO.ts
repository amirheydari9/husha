export class AddFormDataReqDTO {
  constructor(
    public formId: number,
    public formKind: number,
    public model: any,
    public cid?: number,
    public serialId?: number,
    public sid?: number,
    public uid?: number,
    public pid?: number,
    public masterId?: number,
  ) {
  }
}
