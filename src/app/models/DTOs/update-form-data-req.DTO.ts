export class UpdateFormDataReqDTO {
  constructor(
    public formId: number,
    public formKind: number,
    public cid?: number,
    public serialId?: number,
    public sid?: number,
    public uid?: number,
    public pid?: number,
    public masterId?: number,
  ) {
  }
}
