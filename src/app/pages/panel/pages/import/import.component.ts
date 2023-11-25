import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {ActivatedRoute} from "@angular/router";
import {dynamicField} from "../../../../components/dynamic-form/dynamic-form.component";
import {ColDef, GridOptions} from "ag-grid-community";
import {DYNAMIC_FORM_RULES, ENTRY_TYPE, FORM_KIND, INPUT_FIELD_TYPE} from "../../../../constants/enums";
import {HushaFormUtilService} from "../../../../utils/husha-form-util.service";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {HushaCustomerUtilService} from "../../../../utils/husha-customer-util.service";
import {AddListFormDataReqDTO} from "../../../../models/DTOs/add-list-form-data-req.DTO";
import {BaseInfoService} from "../../../../api/base-info.service";
import {GeneralFormComponent} from "../../../../components/general-form/general-form.component";
import {CustomImportExcelComponent} from "../../../../ui-kits/custom-import-excel/custom-import-excel.component";

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

  @ViewChild(CustomImportExcelComponent, {read: CustomImportExcelComponent}) importExcelComp: CustomImportExcelComponent
  @ViewChild('generalForm', {read: GeneralFormComponent}) generalForm: GeneralFormComponent

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
      file: this.fb.control(null, [Validators.required]),
      sheets: this.fb.control(null, [Validators.required])
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
            rules: {[DYNAMIC_FORM_RULES.REQUIRED]: field.notNullable}
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
        this.generalForm.handleResetForm()
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
    this.importExcelComp.handleReadExcel(selectedSheetName).subscribe(data => {
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
    //TODO اگه فیلد nullabel بود و در اکسل موجود نبود بر اساس entryType اگه کاربر بود null اگه دیفالت بود مقدار default رو بفرست
    const models = []
    this.rowData.forEach(row => {
      const model = {}
      for (let key in formData) {
        if (formData[key]) {
          if (row.hasOwnProperty(formData[key])) {
            model[key] = row[formData[key]];
          } else {
            const field = this.form.fields.find(field => field.name == key)
            model[key] = field.entryType === ENTRY_TYPE.BY_USER ? null : field.defaultValue
          }
        } else {
          const field = this.form.fields.find(field => field.name == key)
          model[key] = field.entryType === ENTRY_TYPE.BY_USER ? null : field.defaultValue
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
