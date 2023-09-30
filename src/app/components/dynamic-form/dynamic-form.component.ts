import {Component, Input, NgModule, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomInputTextModule} from "../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomInputNumberModule} from "../../ui-kits/custom-input-number/custom-input-number.component";
import {CustomRadioModule} from "../../ui-kits/custom-radio/custom-radio.component";
import {CustomCheckboxModule} from "../../ui-kits/custom-checkbox/custom-checkbox.component";
import {CustomDropdownModule} from "../../ui-kits/custom-dropdown/custom-dropdown.component";
import {CustomDatePickerModule} from "../../ui-kits/custom-date-picker/custom-date-picker.component";

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="dynamicFormGroup">
      <ng-container *ngFor="let field of fields">
        <ng-container [ngSwitch]="field.type">
          <app-custom-input-text *ngSwitchCase="'text'" [formControlName]="field.name"
                                 [label]="field.label"></app-custom-input-text>
          <app-custom-input-number *ngSwitchCase="'number'" [formControlName]="field.name"
                                   [label]="field.label"></app-custom-input-number>
          <app-custom-dropdown *ngSwitchCase="'dropdown'" [formControlName]="field.name" [options]="field.options"
                               [label]="field.label"></app-custom-dropdown>
          <app-custom-radio *ngSwitchCase="'radio'" [formControlName]="field.name" [options]="field.options"
                            [label]="field.label"></app-custom-radio>
          <app-custom-checkbox *ngSwitchCase="'checkbox'" [formControlName]="field.name"
                               [label]="field.label"></app-custom-checkbox>
          <app-custom-date-picker *ngSwitchCase="'datepicker'" [formControlName]="field.name"
                                  [label]="field.label"></app-custom-date-picker>
        </ng-container>
      </ng-container>
    </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {

  @Input() model: any[];

  dynamicFormGroup: FormGroup;
  fields = [];

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
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
      }
    }
    return validators
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
