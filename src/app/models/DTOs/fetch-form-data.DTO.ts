export class FetchFormDataDTO {
  constructor(
    public cid: number,
    public serialId: number,
    public formId: number,
    public formKind: number,
    public sid: number,
    public uid: number,
    public pid: number,
    public parentId?: number,
  ) {
  }
}
