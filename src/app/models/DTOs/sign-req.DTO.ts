export class SignReqDTO {
  constructor(
    public cid: number,
    public sid: number,
    public uid: number,
    public pid: number,
    public formId: number,
    public formKind: number,
    public serialId: number,
    public ownId: number,
    public positionId: number,
    public signNumber: number,
  ) {
  }
}
