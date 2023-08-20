export class FetchFormDataDTO {
  constructor(
    public cid: number,
    public formId: number,
    public formKind: number,
    public sid: number,
    public uid: number,
    public pid: number,
    public page?: number,
    public size?: number,
    public serialId?: number,
    public parentId?: number,
    public masterId?: number,
  ) {
  }
}
