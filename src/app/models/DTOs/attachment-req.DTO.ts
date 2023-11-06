class DocumentModelDTO {
  constructor(
    public data: string,
    public name: string,
    public desc: string,
    public masterDocumentId: string,
  ) {
  }
}


export class AttachmentReqDTO {
  constructor(
    public formId: number,
    public formKind: number,
    public ownId: number,
    public attachment: DocumentModelDTO,
    public documentId?: string
  ) {
  }
}
