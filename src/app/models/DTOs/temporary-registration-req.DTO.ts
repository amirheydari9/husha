export class TemporaryRegistrationReqDTO {
  constructor(
    public cid: number,
    public sid: number,
    public uid: number,
    public pid: number,
    public formId: number,
    public formKind: number,
    public id: number,
    public detailFormId: number,
    public detailFormKind: number,
  ) {
  }
}
