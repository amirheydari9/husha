export class FetchFormDataByIdDTO {
  constructor(
    public cid: number,
    public serialId: number,
    public formId: number,
    public formKind: number,
    public id: number,
  ) {
  }
}
