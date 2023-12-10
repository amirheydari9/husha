import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogActionsModule} from "../../dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomDropdownModule} from "../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {IFetchFormRes, IFormField} from "../../../models/interface/fetch-form-res.interface";
import {ColDef} from "ag-grid-community";
import {CRITERIA_OPERATION_TYPE, INPUT_FIELD_TYPE, VALUE_TYPE} from "../../../constants/enums";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {HushaFormUtilService} from "../../../utils/husha-form-util.service";
import {CustomInputTextModule} from "../../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomButtonModule} from "../../../ui-kits/custom-button/custom-button.component";
import {criteriaInterface} from "../../../models/DTOs/fetch-all-form-data.DTO";
import {CommonModule} from "@angular/common";
import {CriteriaOperationPipe, CriteriaOperationPipeModule} from "../../../pipes/criteria-operation.pipe";
import {DividerModule} from "primeng/divider";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-advance-search-dialog',
  templateUrl: './advance-search-dialog.component.html',
  styleUrls: ['./advance-search-dialog.component.scss'],
  providers: [
    CriteriaOperationPipe
  ]
})
export class AdvanceSearchDialogComponent implements OnInit {

  subscription: Subscription[] = []

  advanceSearchForm: FormGroup
  keyOptions = []
  criteriaOperationType: CRITERIA_OPERATION_TYPE
  selectedInputFieldType: INPUT_FIELD_TYPE
  form: IFetchFormRes
  colDefs: ColDef[]
  defaultCriteriaOptions = [
    {id: CRITERIA_OPERATION_TYPE.EQUAL, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.EQUAL)},
    {
      id: CRITERIA_OPERATION_TYPE.NOT_EQUAL,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.NOT_EQUAL)
    },
  ]
  textCriteriaOptions = [
    ...this.defaultCriteriaOptions,
    {id: CRITERIA_OPERATION_TYPE.LIKE, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.LIKE)},
    {
      id: CRITERIA_OPERATION_TYPE.CONTAINS,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.CONTAINS)
    },
    {
      id: CRITERIA_OPERATION_TYPE.START_WITH,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.START_WITH)
    },
    {
      id: CRITERIA_OPERATION_TYPE.END_WITH,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.END_WITH)
    },
    {
      id: CRITERIA_OPERATION_TYPE.NOT_NULL,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.NOT_NULL)
    },
    {id: CRITERIA_OPERATION_TYPE.NULL, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.NULL)},
    {
      id: CRITERIA_OPERATION_TYPE.NOT_EMPTY,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.NOT_EMPTY)
    },
    {id: CRITERIA_OPERATION_TYPE.EMPTY, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.EMPTY)},
  ]
  numberCriteriaOptions = [
    ...this.defaultCriteriaOptions,
    {
      id: CRITERIA_OPERATION_TYPE.LESS_THAN,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.LESS_THAN)
    },
    {
      id: CRITERIA_OPERATION_TYPE.LESS_THAN_EQUAL,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.LESS_THAN_EQUAL)
    },
    {
      id: CRITERIA_OPERATION_TYPE.GREATER_THAN,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.GREATER_THAN)
    },
    {
      id: CRITERIA_OPERATION_TYPE.GREATER_THAN_EQUAL,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.GREATER_THAN_EQUAL)
    },
    {id: CRITERIA_OPERATION_TYPE.BETWEEN, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.BETWEEN)},
  ]

  booleanCriteriaOptions = [
    {id: CRITERIA_OPERATION_TYPE.EQUAL, title: "مساوی"},
  ]

  booleanValueOptions = [
    {id: "true", title: "بله"},
    {id: "false", title: "خیر"}
  ]

  criteriaOptions = []
  totalCriteria: criteriaInterface[] = []
  criteriaList = []

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    private hushaFormUtilService: HushaFormUtilService,
    private criteriaOperationPipe: CriteriaOperationPipe
  ) {
    dynamicDialogConfig.header = 'جستجوی پیشرفته'
    dynamicDialogConfig.height = '50vh'
    this.form = this.dynamicDialogConfig.data.form
    this.colDefs = this.dynamicDialogConfig.data.colDefs
  }

  ngOnInit() {

    // TODO implement between
    this.advanceSearchForm = this.fb.group({
      key: this.fb.control(null, [Validators.required]),
      operation: this.fb.control({value: null, disabled: true}, [Validators.required]),
      value: this.fb.control({value: null, disabled: true})
    })

    this.subscription.push(
      this.keyCtrl.valueChanges.subscribe(data => {
        this.operationCtrl.setValue(null)
        this.valueCtrl.setValue(null)
        this.criteriaOptions = []
        if (data) {
          this.operationCtrl.enable()
          this.valueCtrl.enable()
          this.handleCreateCriteriaOptions(data)
        } else {
          this.selectedInputFieldType = null
          this.operationCtrl.disable()
          this.valueCtrl.disable()
        }
      })
    )

    this.subscription.push(
      this.operationCtrl.valueChanges.subscribe(data => {
        this.criteriaOperationType = data
        if (!this.showValueInput) {
          this.valueCtrl.setValue(null, {emitEvent: false})
        }
      })
    )

    this.handleCreateKeyOptions()
    this.handleCreateCriteriaList()
  }

  handleCreateKeyOptions() {
    //TODO dropdown and ...
    const filteredField = this.form.fields.filter(field =>
      field.fieldType.id === INPUT_FIELD_TYPE.TEXT ||
      field.fieldType.id === INPUT_FIELD_TYPE.NUMBER ||
      field.fieldType.id === INPUT_FIELD_TYPE.TEXT_AREA ||
      field.fieldType.id === INPUT_FIELD_TYPE.SWITCH
    )
    filteredField.forEach(field => {
      this.colDefs.forEach(col => {
        if (col.field === field.name) {
          this.keyOptions.push({
            id: col.field,
            title: col.headerName,
            valueType: this.handleValueType(field)
          })
        }
      })
    })
  }

  handleCreateCriteriaList() {
    if (this.dynamicDialogConfig.data.criteria) {
      this.dynamicDialogConfig.data.criteria.forEach(cr => {
        const keyOption = this.keyOptions.find(key => key.id === cr.key)
        this.criteriaList.push({
          title: keyOption.title,
          key: cr.key,
          operation: cr.operation,
          value: cr.value,
          valueType: cr.valueType,
          id: this.criteriaList.length + 1
        })
      })
    }
  }

  get keyCtrl(): FormControl {
    return this.advanceSearchForm.controls['key'] as FormControl
  }

  get operationCtrl(): FormControl {
    return this.advanceSearchForm.controls['operation'] as FormControl
  }

  get valueCtrl(): FormControl {
    return this.advanceSearchForm.controls['value'] as FormControl
  }

  get CRITERIA_OPERATION_TYPE(): typeof CRITERIA_OPERATION_TYPE {
    return CRITERIA_OPERATION_TYPE
  }

  get INPUT_FIELD_TYPE(): typeof INPUT_FIELD_TYPE {
    return INPUT_FIELD_TYPE
  }

  get showValueInput() {
    return [
      CRITERIA_OPERATION_TYPE.NULL,
      CRITERIA_OPERATION_TYPE.NOT_NULL,
      CRITERIA_OPERATION_TYPE.EMPTY,
      CRITERIA_OPERATION_TYPE.NOT_EMPTY
    ].indexOf(this.operationCtrl.value) === -1
  }

  //TODO dropdown and ...
  handleValueType(field: IFormField): VALUE_TYPE {
    const fieldType = this.hushaFormUtilService.handleType(field)
    switch (fieldType) {
      case INPUT_FIELD_TYPE.TEXT:
      case INPUT_FIELD_TYPE.TEXT_AREA:
        return VALUE_TYPE.STRING
      case INPUT_FIELD_TYPE.NUMBER:
        return VALUE_TYPE.NUMBER
      case INPUT_FIELD_TYPE.SWITCH:
        return VALUE_TYPE.BOOLEAN
      default :
        return VALUE_TYPE.STRING
    }
  }


  //TODO dropdown and ...
  handleCreateCriteriaOptions(fieldName: string) {
    const fieldType = this.hushaFormUtilService.handleType(this.form.fields.find(field => field.name === fieldName))
    this.selectedInputFieldType = fieldType
    switch (fieldType) {
      case INPUT_FIELD_TYPE.TEXT:
      case INPUT_FIELD_TYPE.TEXT_AREA:
        this.criteriaOptions = this.textCriteriaOptions
        break
      case INPUT_FIELD_TYPE.NUMBER:
        this.criteriaOptions = this.numberCriteriaOptions
        break
      case INPUT_FIELD_TYPE.SWITCH:
        this.criteriaOptions = this.booleanCriteriaOptions
    }
    return this.criteriaOptions
  }

  handleAddCriteria() {
    const selectedKeyOption = this.keyOptions.find(key => key.id === this.keyCtrl.value)
    this.criteriaList.unshift({
      ...this.advanceSearchForm.getRawValue(),
      title: selectedKeyOption.title,
      valueType: selectedKeyOption.valueType,
      id: this.criteriaList.length + 1,
    })
    this.formGroupDirective.resetForm()
  }

  handleClose() {
    this.totalCriteria = this.criteriaList.map(cr => ({
      key: cr.key,
      operation: cr.operation,
      value: cr.value,
      valueType: cr.valueType
    }))
    this.ref.close(this.totalCriteria)
    console.log(this.totalCriteria)
  }

  removeCriteria(id) {
    this.criteriaList = this.criteriaList.filter(cr => cr.id !== id)
  }
}

@NgModule({
  declarations: [AdvanceSearchDialogComponent],
  imports: [
    DynamicDialogActionsModule,
    ReactiveFormsModule,
    CustomDropdownModule,
    CustomInputTextModule,
    CustomButtonModule,
    CommonModule,
    CriteriaOperationPipeModule,
    DividerModule
  ],
  exports: [AdvanceSearchDialogComponent],
})
export class AdvanceSearchDialogModule {

}
