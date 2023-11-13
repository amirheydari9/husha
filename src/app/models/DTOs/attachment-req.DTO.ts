export class DocumentModelDTO {
  constructor(
    public name: string,
    public desc: string,
    public masterDocumentId: string,
    public data?: string,
  ) {
  }
}


export class AttachmentReqDTO {
  constructor(
    public formId: number,
    public formKind: number,
    public ownId: number,
    public attachment?: DocumentModelDTO,
    public documentId?: string
  ) {
  }
}
