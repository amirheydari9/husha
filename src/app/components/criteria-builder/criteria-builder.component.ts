import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from "@angular/forms";
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {ColDef} from "ag-grid-community";
import {CRITERIA_OPERATION_TYPE, INPUT_FIELD_TYPE, VALUE_TYPE} from "../../constants/enums";
import {CriteriaOperationPipe} from "../../pipes/criteria-operation.pipe";
import {HushaFormUtilService} from "../../utils/husha-form-util.service";
import {CustomValidators} from "../../utils/Custom-Validators";
import {CustomDropdownModule} from "../../ui-kits/custom-dropdown/custom-dropdown.component";
import {CommonModule} from "@angular/common";
import {CustomSwitchModule} from "../../ui-kits/custom-switch/custom-switch.component";
import {CustomMultiSelectModule} from "../../ui-kits/custom-multi-select/custom-multi-select.component";
import {CustomInputTextModule} from "../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-criteria-builder',
  templateUrl: './criteria-builder.component.html',
  styleUrls: ['./criteria-builder.component.scss'],
  providers: [
    CriteriaOperationPipe
  ]
})
export class CriteriaBuilderComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective

  @Input() form: IFetchFormRes
  @Input() colDefs: ColDef[]

  @Output() onAddCriteria: EventEmitter<any> = new EventEmitter<any>()

  subscription: Subscription[] = []

  advanceSearchForm: FormGroup
  keyOptions = []
  criteriaOperationType: CRITERIA_OPERATION_TYPE
  selectedInputFieldType: INPUT_FIELD_TYPE
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
    {id: CRITERIA_OPERATION_TYPE.EQUAL, title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.EQUAL)},
  ]
  dropDownCriteriaOptions = [
    {
      id: CRITERIA_OPERATION_TYPE.IN,
      title: this.criteriaOperationPipe.transform(CRITERIA_OPERATION_TYPE.IN)
    },
  ]

  dropDownValueOptions = []
  criteriaOptions = []

  constructor(
    private fb: FormBuilder,
    private hushaFormUtilService: HushaFormUtilService,
    private criteriaOperationPipe: CriteriaOperationPipe,
  ) {
  }

  ngOnInit() {
    this.advanceSearchForm = this.fb.group({
      key: this.fb.control(null, [Validators.required]),
      operation: this.fb.control({value: null, disabled: true}, [Validators.required]),
      value: this.fb.control({value: null, disabled: true}, [Validators.required])
    })

    this.subscription.push(
      this.keyCtrl.valueChanges.subscribe(async data => {
        this.operationCtrl.setValue(null)
        this.valueCtrl.setValue(null)
        this.criteriaOptions = []
        if (data) {
          this.operationCtrl.enable()
          this.valueCtrl.enable()
          this.handleCreateCriteriaOptions(data)
          await this.handleValueOptions(data)
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


  }

  handleCreateKeyOptions() {
    //TODO dropdown and ...
    const filteredField = this.form.fields.filter(field =>
      field.fieldType.id === INPUT_FIELD_TYPE.TEXT ||
      field.fieldType.id === INPUT_FIELD_TYPE.NUMBER ||
      field.fieldType.id === INPUT_FIELD_TYPE.TEXT_AREA ||
      field.fieldType.id === INPUT_FIELD_TYPE.SWITCH ||
      field.fieldType.id === INPUT_FIELD_TYPE.DROP_DOWN
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
      case INPUT_FIELD_TYPE.DROP_DOWN:
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
        this.valueCtrl.addValidators([CustomValidators.noWhitespace])
        break
      case INPUT_FIELD_TYPE.NUMBER:
        this.criteriaOptions = this.numberCriteriaOptions
        break
      case INPUT_FIELD_TYPE.SWITCH:
        this.criteriaOptions = this.booleanCriteriaOptions
        this.valueCtrl.removeValidators([CustomValidators.noWhitespace])
        break
      case INPUT_FIELD_TYPE.DROP_DOWN:
        this.criteriaOptions = this.dropDownCriteriaOptions
        this.valueCtrl.removeValidators([CustomValidators.noWhitespace])
    }
    return this.criteriaOptions
  }

  async handleValueOptions(fieldName: string) {
    const field = this.form.fields.find(field => field.name === fieldName)
    this.dropDownValueOptions = await this.hushaFormUtilService.handleOptions(field)
  }


  handleAddCriteria() {
    const selectedKeyOption = this.keyOptions.find(key => key.id === this.keyCtrl.value)
    const criteria = {
      ...this.advanceSearchForm.getRawValue(),
      title: selectedKeyOption.title,
      valueType: selectedKeyOption.valueType,
    }
    this.formGroupDirective.resetForm()
    this.onAddCriteria.emit(criteria)
  }
}


@NgModule({
  declarations: [CriteriaBuilderComponent],
  imports: [
    ReactiveFormsModule,
    CustomDropdownModule,
    CommonModule,
    CustomSwitchModule,
    CustomMultiSelectModule,
    CustomInputTextModule,
    CustomButtonModule
  ],
  exports: [CriteriaBuilderComponent]
})
export class CriteriaBuilderModule {

}
