export class DeleteFormDataDTO {
  constructor(
    public cid: number,
    public serialId: number,
    public formId: number,
    public formKind: number,
    public id: number,
    public uid?: number,
    public pid?: number,
  ) {
  }
}
