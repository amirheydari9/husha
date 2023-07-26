export class FetchAllShowReqDTO {
  constructor(
    public page?: number,
    public size?: number,
    public sort?: string,
  ) {
  }
}
