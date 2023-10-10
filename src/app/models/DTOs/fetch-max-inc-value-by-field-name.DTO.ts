export class FetchMaxIncValueByFieldNameDTO {
  constructor(
    public cid: number,
    public serialId: number,
    public formId: number,
    public formKind: number,
    public fieldName: string,
    public uid?: number,
    public pid?: number,
  ) {
  }
}
