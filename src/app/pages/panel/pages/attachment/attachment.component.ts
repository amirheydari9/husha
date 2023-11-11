import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AttachmentReqDTO, DocumentModelDTO} from "../../../../models/DTOs/attachment-req.DTO";
import {dynamicField} from "../../../../components/dynamic-form/dynamic-form.component";
import {INPUT_FIELD_TYPE} from "../../../../constants/enums";
import {ColDef, GridOptions, RowSelectedEvent} from "ag-grid-community";
import {AttachmentRes} from "../../../../models/interface/attachment-res.interface";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {

  subscription: Subscription [] = []
  form: IFetchFormRes
  model: dynamicField[] = [
    {
      label: 'نام فایل',
      name: 'name',
      type: INPUT_FIELD_TYPE.TEXT,
      rules: {required: true}
    },
    {
      label: 'فایل',
      name: 'data',
      type: INPUT_FIELD_TYPE.FILE,
      rules: {required: true}
    },
    {
      label: 'توضیحات',
      name: 'desc',
      type: INPUT_FIELD_TYPE.TEXT_AREA,
    }
  ]

  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد',
    rowSelection: 'single'
  }
  columnDefs: ColDef[] = [
    {headerName: 'نام فایل', field: 'name'},
    {headerName: 'ایجاد توسط', field: 'createBy'},
    {headerName: 'تاریخ ایجاد', field: 'createAt'},
    {headerName: 'توضیحات', field: 'desc'},
    {headerName: 'دانلود فایل', field: 'data'},
  ]
  rowData = []
  selectedRow: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService
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

  handleSubmitForm($event: any, data?: AttachmentRes) {
    const attachment = new DocumentModelDTO(
      $event['name'],
      $event['desc'],
      this.rowData.length ? this.rowData[0].id : null,
      $event['data'],
    )
    this.subscription.push(
      this.baseInfoService.addAttachment(this.handleAttachmentPayload(attachment)).subscribe(data => {
        this.rowData = [...this.rowData, data]
      })
    )
  }

  handleRowSelected($event: RowSelectedEvent<any>) {
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

  handleUpdateAttachment() {
    this.model = this.model.map(model => {
      model.value = this.selectedRow[model.name]
      return model
    })
    console.log(this.model)
  }
}
