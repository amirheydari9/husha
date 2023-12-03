import {Component, NgModule} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {GridActionsModule} from "../../grid-actions/grid-actions.component";
import {CustomGridModule} from "../../../ui-kits/custom-grid/custom-grid.component";
import {Subscription} from "rxjs";
import {ACCESS_FORM_ACTION_TYPE} from "../../../constants/enums";
import {IFetchFormRes} from "../../../models/interface/fetch-form-res.interface";
import {ColDef, GridApi} from "ag-grid-community";
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
      [selectedRow]="selectedRow"
      (onAction)="handleOnAction($event)"
    ></app-grid-actions>
    <app-custom-grid
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="this.gridApi = $event.api"
    ></app-custom-grid>
  `,
  styles: []
})
export class AttachmentListDialogComponent {

  gridApi: GridApi;
  rowData: any[] | null

  subscription: Subscription [] = []
  accessFormActions = [
    ACCESS_FORM_ACTION_TYPE.ADD,
    ACCESS_FORM_ACTION_TYPE.UPDATE,
    ACCESS_FORM_ACTION_TYPE.DELETE,
    ACCESS_FORM_ACTION_TYPE.DELETE_ALL,
    ACCESS_FORM_ACTION_TYPE.DOWNLOAD_FILE
  ];
  form: IFetchFormRes
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
  }

  ngOnInit(): void {
    this.form = this.dynamicDialogConfig.data.form
    this.subscription.push(
      this.baseInfoService.getAllAttachments(this.handleAttachmentPayload()).subscribe(attachments => {
        this.rowData = attachments
      })
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

  get selectedRow() {
    return this.gridApi?.getSelectedRows()[0]
  }

  handleOnAction($event: ACCESS_FORM_ACTION_TYPE) {
    switch ($event) {
      case ACCESS_FORM_ACTION_TYPE.ADD:
        this.attachment = null
        this.openDialog()
        break
      case ACCESS_FORM_ACTION_TYPE.UPDATE:
        this.attachment = this.selectedRow
        this.openDialog()
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
          this.rowData.length > 1 ? this.rowData[0].id : null,
          data['data'],
        )
        if (this.attachment) {
          this.subscription.push(
            this.baseInfoService.updateAttachment(this.handleAttachmentPayload(attachment, this.attachment.id))
              // .subscribe(data => this.gridApi.getSelectedNodes()[0].setData(data))
              .subscribe(data => {
                const itemsToUpdate: any[] = [];
                this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
                  if (rowNode.data.id === data.id) rowNode.data = data
                  itemsToUpdate.push(data);
                });
                this.gridApi.applyTransaction({update: itemsToUpdate})
              })
          )
        } else {
          this.subscription.push(
            this.baseInfoService.addAttachment(this.handleAttachmentPayload(attachment))
              .subscribe(data => this.gridApi.applyTransaction({add: [data]}))
          )
        }
      }
    })
  }

  handleDeleteAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAttachment(this.handleAttachmentPayload(null, this.selectedRow.id))
        // .subscribe(data => this.gridApi.applyTransaction({remove: [{id: this.selectedRow.id}]}))
        .subscribe(data => {
          const selectedData = this.gridApi.getSelectedRows();
          this.gridApi.applyTransaction({remove: selectedData});
        })
    )
  }

  handleDeleteAllAttachment() {
    this.subscription.push(
      this.baseInfoService.removeAllAttachment(this.handleAttachmentPayload(null, this.gridApi.getRenderedNodes()[0].data.id))
        // .subscribe(data => this.gridApi.setRowData([]))
        .subscribe(data => {
          const rowData: any[] = [];
          this.gridApi.forEachNode((node) => rowData.push(node.data))
          this.gridApi.applyTransaction({remove: rowData})
        })
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
