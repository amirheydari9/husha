import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AttachmentReqDTO, DocumentModelDTO} from "../../../../models/DTOs/attachment-req.DTO";
import {ACCESS_FORM_ACTION_TYPE} from "../../../../constants/enums";
import {ColDef, GridOptions, RowClickedEvent} from "ag-grid-community";
import {AttachmentRes} from "../../../../models/interface/attachment-res.interface";
import {DateService} from "../../../../utils/date.service";
import {FileService} from "../../../../utils/file.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {

  subscription: Subscription [] = []
  accessFormActions = [
    ACCESS_FORM_ACTION_TYPE.ADD,
    ACCESS_FORM_ACTION_TYPE.UPDATE,
    ACCESS_FORM_ACTION_TYPE.DELETE,
    ACCESS_FORM_ACTION_TYPE.DELETE_ALL,
    ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE
  ];
  form: IFetchFormRes
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد',
    rowSelection: 'single'
  }
  columnDefs: ColDef[] = [
    {headerName: 'نام فایل', field: 'name'},
    {headerName: 'نام', field: 'createBy.name'},
    {headerName: 'نام خانوادگی', field: 'createBy.family'},
    {
      headerName: 'تاریخ ایجاد',
      field: 'createAt',
      cellRenderer: data => this.dateService.timestampToJalali(data.value)
    },
    {headerName: 'توضیحات', field: 'desc'},
  ]
  rowData = []
  selectedRow: any
  showDialog: boolean = false
  attachment: AttachmentRes

  constructor(
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
    private dateService: DateService,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {

    this.subscription.push(
      this.activatedRoute.params.subscribe(params => {
        this.form = this.activatedRoute.snapshot.data['data']
        this.subscription.push(
          this.baseInfoService.getAllAttachments(this.handleAttachmentPayload()).subscribe(attachments => {
            this.rowData = attachments
          })
        )
      })
    )
  }

  handleAttachmentPayload(attachment?: DocumentModelDTO, documentId?: string) {
    return new AttachmentReqDTO(
      this.form.id,
      this.form.formKind.id,
      +this.activatedRoute.snapshot.params['ownId'],
      attachment,
      documentId
    )
  }

  handleRowSelected($event: RowClickedEvent<any>) {
    this.selectedRow = $event.data
  }

  handleDeleteAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAttachment(this.handleAttachmentPayload(null, this.selectedRow.id)).subscribe(data => {
        this.rowData = this.rowData.filter(item => item.id !== this.selectedRow.id)
      })
    )
  }

  handleDeleteAllAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAllAttachment(this.handleAttachmentPayload(null, this.rowData[0].id)).subscribe(data => {
        this.rowData = []
      })
    )
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    switch ($event) {
      case ACCESS_FORM_ACTION_TYPE.ADD:
        this.attachment = null
        this.showDialog = true
        break
      case ACCESS_FORM_ACTION_TYPE.UPDATE:
        this.attachment = this.selectedRow
        this.showDialog = true
        break;
      case ACCESS_FORM_ACTION_TYPE.DELETE:
        this.handleDeleteAttachment()
        break
      case ACCESS_FORM_ACTION_TYPE.DELETE_ALL:
        this.handleDeleteAllAttachment()
        break
      case ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE:
        this.fileService.downloadBase64(this.selectedRow.data, this.selectedRow.name)
    }
  }

  handleOnHideDialog($event: any) {
    if ($event) {
      const attachment = new DocumentModelDTO(
        $event['name'],
        $event['desc'],
        this.rowData.length > 1 ? this.rowData[0].id : null,
        this.attachment ? null : $event['data'],
      )
      if (this.attachment) {
        this.subscription.push(
          this.baseInfoService.updateAttachment(this.handleAttachmentPayload(attachment, this.attachment.id)).subscribe(data => {
            this.rowData = this.rowData.map(item => {
              if (item.id === data.id) item = data
              return item
            })
          })
        )
      } else {
        this.subscription.push(
          this.baseInfoService.addAttachment(this.handleAttachmentPayload(attachment)).subscribe(data => this.rowData = [...this.rowData, data])
        )
      }
    }
  }
}
