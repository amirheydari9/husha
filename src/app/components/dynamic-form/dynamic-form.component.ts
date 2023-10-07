import {Component, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomInputTextModule} from "../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomInputNumberModule} from "../../ui-kits/custom-input-number/custom-input-number.component";
import {CustomRadioModule} from "../../ui-kits/custom-radio/custom-radio.component";
import {CustomCheckboxModule} from "../../ui-kits/custom-checkbox/custom-checkbox.component";
import {CustomDropdownModule} from "../../ui-kits/custom-dropdown/custom-dropdown.component";
import {CustomDatePickerModule} from "../../ui-kits/custom-date-picker/custom-date-picker.component";
import {CustomValidators} from "../../utils/Custom-Validators";
import {INPUT_FIELD_TYPE} from "../../constants/enums";

export interface dynamicField {
  type: INPUT_FIELD_TYPE;
  name: string;
  label: string;
  value?: any,
  disabled?: boolean,
  options?: any[];
  rules?: {}
}

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="dynamicFormGroup" class="flex align-items-center flex-wrap justify-content-start">
      <ng-container *ngFor="let field of fields">
        <ng-container [ngSwitch]="field.type">
          <div class="col-3">
            <app-custom-input-text
              *ngSwitchCase="INPUT_FIELD_TYPE.TEXT"
              [formControlName]="field.name"
              [label]="field.label"
            ></app-custom-input-text>
            <app-custom-input-number
              *ngSwitchCase="INPUT_FIELD_TYPE.NUMBER"
              [formControlName]="field.name"
              [label]="field.label"
            ></app-custom-input-number>
            <app-custom-dropdown
              *ngSwitchCase="INPUT_FIELD_TYPE.DROP_DOWN"
              [formControlName]="field.name"
              [options]="field.options"
              [label]="field.label"
            ></app-custom-dropdown>
            <app-custom-radio
              *ngSwitchCase="'radio'"
              [formControlName]="field.name"
              [options]="field.options"
              [label]="field.label"
            ></app-custom-radio>
            <app-custom-checkbox
              *ngSwitchCase="'checkbox'"
              [formControlName]="field.name"
              [label]="field.label"
            ></app-custom-checkbox>
            <app-custom-date-picker
              *ngSwitchCase="'datepicker'"
              [formControlName]="field.name"
              [label]="field.label"
            ></app-custom-date-picker>
          </div>
        </ng-container>
      </ng-container>
    </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {

  @Input() model: dynamicField[];
  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;

  dynamicFormGroup: FormGroup;
  fields = [];

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  get INPUT_FIELD_TYPE(): typeof INPUT_FIELD_TYPE {
    return INPUT_FIELD_TYPE
  }

  buildForm() {
    this.dynamicFormGroup = this.fb.group(this.getFormControlsFields());
  }

  getFormControlsFields() {
    const formGroupFields = {};
    this.model.forEach(field => {
      formGroupFields[field.name] = this.fb.control({
        value: field.value,
        disabled: field.disabled
      }, DynamicFormComponent.addValidators(field.rules));
      this.fields.push(field);
    })
    return formGroupFields;
  }

  private static addValidators(rules) {
    if (!rules) {
      return [];
    }
    const validators = []
    for (const [key, value] of Object.entries(rules)) {
      if (key === 'required') {
        if (value == true) validators.push(Validators.required)
      } else if (key === 'maxLength') {
        validators.push(Validators.maxLength(+value))
      } else if (key === 'maxLength') {
        validators.push(Validators.maxLength(+value))
      } else if (key === 'minLength') {
        validators.push(Validators.minLength(+value))
      } else if (key === 'max') {
        validators.push(Validators.max(+value))
      } else if (key === 'min') {
        validators.push(Validators.min(+value))
      } else if (key === 'email') {
        validators.push(Validators.email)
      } else if (key === 'url') {
        validators.push(CustomValidators.url)
      } else if (key === 'acceptedFileType') {
        // TODO بر اساس نوع فابل آرگومان پر شود
        validators.push(CustomValidators.acceptedFileType([]))
      }
    }
    return validators
  }

  resetForm() {
    this.formRef.reset()
  }
}

@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgFor,
    ReactiveFormsModule,
    CustomInputTextModule,
    CustomInputNumberModule,
    CustomRadioModule,
    CustomCheckboxModule,
    CustomDropdownModule,
    CustomDatePickerModule
  ],
  exports: [DynamicFormComponent]
})
export class DynamicFormModule {

}
