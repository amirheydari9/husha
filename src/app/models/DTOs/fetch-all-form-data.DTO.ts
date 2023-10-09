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
  ) {
  }
}
