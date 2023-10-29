import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {ReadExcelDirective} from "../../../../directives/read-excel.directive";
import {ActivatedRoute} from "@angular/router";
import {dynamicField, DynamicFormComponent} from "../../../../components/dynamic-form/dynamic-form.component";
import {ColDef, GridOptions} from "ag-grid-community";
import {FORM_KIND, INPUT_FIELD_TYPE} from "../../../../constants/enums";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";
import {AddListFormDataReqDTO} from "../../../../models/DTOs/add-list-form-data-req.DTO";
import {BaseInfoService} from "../../../../api/base-info.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  subscription: Subscription[] = []
  importExcelForm: FormGroup
  sheetOptions = []
  model: dynamicField[] = []
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد'
  }
  rowData = []
  form: IFetchFormRes

  @ViewChild('readExcel', {read: ReadExcelDirective}) readExcel: ReadExcelDirective
  @ViewChild('dynamicForm') dynamicForm: DynamicFormComponent

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService
  ) {
  }


  ngOnInit(): void {

    this.importExcelForm = this.fb.group({
      file: this.fb.control(null),
      sheets: this.fb.control(null)
    })

    this.subscription.push(
      this.activatedRoute.params.subscribe(() => {
        this.form = this.activatedRoute.snapshot.data['data']
        const formFields = this.hushaFormUtilService.handleShowFields(this.form.fields)
        formFields.forEach(field => {
          const model: dynamicField = {
            type: INPUT_FIELD_TYPE.DROP_DOWN,
            name: field.name,
            label: field.caption,
            rules: {required: true}
          }
          this.model.push(model)
        })
      })
    )

    this.subscription.push(
      this.importExcelForm.controls['sheets'].valueChanges.subscribe(data => {
        this.columnDefs = []
        this.rowData = []
        this.model.map(item => {
          item.options = []
          return item
        })
        this.dynamicForm.resetForm()
        if (data) this.readSheet(data)
      })
    )

    this.subscription.push(
      this.importExcelForm.controls['file'].valueChanges.subscribe(data => {
        this.importExcelForm.controls['sheets'].setValue(null)
      })
    )

  }


  readSheet(selectedSheetName: string) {
    this.readExcel.readSheet(selectedSheetName).subscribe(data => {
      this.model.map(item => {
        item.options = data.header
        return item
      })
      const coldDefs: ColDef[] = []
      data.header.map(item => coldDefs.push({field: item}))
      this.columnDefs = coldDefs
      this.rowData = data.rowData
    })
  }

  handleSubmitForm(formData: any) {
    //TODO در حالت ایجاد دسته ای اینکه فیلد توسط کاربر پر شود یا از دیفالت بخواند توجه شود
    const models = []
    this.rowData.forEach(row => {
      const model = {}
      for (let key in formData) {
        if (row.hasOwnProperty(formData[key])) {
          model[key] = row[formData[key]];
        }
      }
      models.push(model)
    })
    const formKindId = this.form.formKind.id
    const payload = new AddListFormDataReqDTO(
      this.form.id,
      formKindId,
      models,
      formKindId === FORM_KIND.DETAIL ? null : this.hushaCustomerUtilService.customer.id,
      formKindId === FORM_KIND.MULTI_LEVEL || formKindId === FORM_KIND.FLAT ? this.hushaCustomerUtilService.serviceTypeId : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.service.id : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
      formKindId === FORM_KIND.DETAIL ? this.activatedRoute.snapshot.queryParams['masterId'] : null,
    )
    this.baseInfoService.addListFormData(payload).subscribe(data => {
      console.log(data)
    })
  }
}
