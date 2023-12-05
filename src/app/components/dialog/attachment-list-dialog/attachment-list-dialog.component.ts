import {Component, NgModule, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {GridActionsModule} from "../../grid-actions/grid-actions.component";
import {CustomGridComponent, CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {Subscription} from "rxjs";
import {ACCESS_FORM_ACTION_TYPE} from "../../../constants/enums";
import {IFetchFormRes} from "../../../models/interface/fetch-form-res.interface";
import {ColDef} from "ag-grid-community";
import {AttachmentRes} from "../../../models/interface/attachment-res.interface";
import {BaseInfoService} from "../../../api/base-info.service";
import {DateService} from "../../../utils/date.service";
import {FileService} from "../../../utils/file.service";
import {DialogManagementService} from "../../../utils/dialog-management.service";
import {AttachmentReqDTO, DocumentModelDTO} from "../../../models/DTOs/attachment-req.DTO";
import {AttachmentDialogComponent} from "../attachment-dialog/attachment-dialog.component";

@Component({
  selector: 'app-attachment-list-dialog',
  template: `
    <app-grid-actions
      [accessFormActions]="accessFormActions"
      [selectedRow]="grid?.selectedRows"
      (onAction)="handleOnAction($event)"
    ></app-grid-actions>
    <app-custom-grid
      #grid
      [columnDefs]="columnDefs"
      [rowData]="rowData"
    ></app-custom-grid>
  `,
  styles: []
})
export class AttachmentListDialogComponent {

  subscription: Subscription [] = []

  @ViewChild('grid') grid: CustomGridComponent
  rowData: any[] | null
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

  accessFormActions = [
    ACCESS_FORM_ACTION_TYPE.ADD,
    ACCESS_FORM_ACTION_TYPE.UPDATE,
    ACCESS_FORM_ACTION_TYPE.DELETE,
    ACCESS_FORM_ACTION_TYPE.DELETE_ALL,
    ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE
  ];
  form: IFetchFormRes
  showDialog: boolean = false
  attachment: AttachmentRes

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private baseInfoService: BaseInfoService,
    private dateService: DateService,
    private fileService: FileService,
    private dialogManagementService: DialogManagementService
  ) {
    dynamicDialogConfig.header = 'لیست ضمیمه ها'
    dynamicDialogConfig.closable = true
  }

  ngOnInit(): void {
    this.form = this.dynamicDialogConfig.data.form
    this.subscription.push(
      this.baseInfoService.getAllAttachments(this.handleAttachmentPayload())
        .subscribe(attachments => this.rowData = attachments)
    )
  }

  handleAttachmentPayload(attachment?: DocumentModelDTO, documentId?: string) {
    return new AttachmentReqDTO(
      this.form.id,
      this.form.formKind.id,
      this.dynamicDialogConfig.data.ownId,
      attachment,
      documentId
    )
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    switch ($event) {
      case ACCESS_FORM_ACTION_TYPE.ADD:
        this.attachment = null
        this.openDialog()
        break
      case ACCESS_FORM_ACTION_TYPE.UPDATE:
        this.attachment = this.grid.selectedRows
        this.openDialog()
        break;
      case ACCESS_FORM_ACTION_TYPE.DELETE:
        this.handleDeleteAttachment()
        break
      case ACCESS_FORM_ACTION_TYPE.DELETE_ALL:
        this.handleDeleteAllAttachment()
        break
      case ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE:
        this.fileService.downloadBase64(this.grid.selectedRows.data, this.grid.selectedRows.name)
    }
  }

  openDialog() {
    this.dialogManagementService.openDialog(AttachmentDialogComponent, {
      data: {form: this.form, attachment: this.attachment},
      width: '25vw',
      header: this.attachment ? 'ویرایش ضمیمه' : 'ضمیمه جدید'
    }).subscribe(data => {
      if (data) {
        const attachment = new DocumentModelDTO(
          data['name'],
          data['desc'],
          this.grid.rowDataCount >= 1 ? this.grid.allRows[0].data.id : null,
          data['data'],
        )
        if (this.attachment) {
          this.subscription.push(
            this.baseInfoService.updateAttachment(this.handleAttachmentPayload(attachment, this.attachment.id))
              .subscribe(data => this.grid.updateRow(data))
          )
        } else {
          this.subscription.push(
            this.baseInfoService.addAttachment(this.handleAttachmentPayload(attachment))
              .subscribe(data => this.grid.addRows([data]))
          )
        }
      }
    })
  }

  handleDeleteAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAttachment(this.handleAttachmentPayload(null, this.grid.selectedRows.id))
        .subscribe(data => this.grid.removeSelectedRows())
    )
  }

  handleDeleteAllAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAllAttachment(this.handleAttachmentPayload(null, this.grid.allRows[0].data.id))
        .subscribe(data => this.grid.clearData())
    )
  }

}

@NgModule({
  declarations: [AttachmentListDialogComponent],
  imports: [
    GridActionsModule,
    CustomGridModule,
  ],
  exports: [AttachmentListDialogComponent]
})
export class AttachmentListDialogModule {

}
