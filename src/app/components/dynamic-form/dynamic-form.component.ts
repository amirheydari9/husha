import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomInputTextModule} from "../../ui-kits/custom-input-text/custom-input-text.component";
import {CustomInputNumberModule} from "../../ui-kits/custom-input-number/custom-input-number.component";
import {CustomDropdownModule} from "../../ui-kits/custom-dropdown/custom-dropdown.component";
import {
  CustomJalaliDatePickerModule
} from "../../ui-kits/custom-jalali-date-picker/custom-jalali-date-picker.component";
import {CustomValidators} from "../../utils/Custom-Validators";
import {INPUT_FIELD_TYPE} from "../../constants/enums";
import {CustomSwitchModule} from "../../ui-kits/custom-switch/custom-switch.component";
import {DividerModule} from "primeng/divider";
import {CustomTextAreaModule} from "../../ui-kits/custom-text-area/custom-text-area.component";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";
import {
  CustomGeorgianDatePickerModule
} from "../../ui-kits/custom-georgian-date-picker/custom-georgian-date-picker.component";
import {CustomLookupFormModule} from "../../ui-kits/custom-lookup-form/custom-lookup-form.component";
import {CustomUploadFileModule} from "../../ui-kits/custom-upload-file/custom-upload-file.component";

export interface dynamicField {
  type: INPUT_FIELD_TYPE;
  name: string;
  label: string;
  value?: any,
  disabled?: boolean,
  options?: any[];
  rules?: {},
  meta?: {}
}

@Component({
  selector: 'app-dynamic-form',
  template: `
    <app-custom-card>

      <span class="font-md-regular mr-2 text-1">{{label}}</span>

      <p-divider></p-divider>

      <form [formGroup]="dynamicFormGroup" (ngSubmit)="onSubmit.emit(dynamicFormGroup.getRawValue())">
        <div class="flex flex-row flex-wrap justify-content-start align-items-center"
             *ngFor="let group of groups;let index = index">
          <div [class]="handleCalculateCol(field.type)" *ngFor="let field of group">
            <ng-container [ngSwitch]="field.type">
              <app-custom-input-text
                *ngSwitchCase="INPUT_FIELD_TYPE.TEXT"
                [formControlName]="field.name"
                [label]="field.label"
              ></app-custom-input-text>
              <app-custom-input-number
                *ngSwitchCase="INPUT_FIELD_TYPE.NUMBER"
                [formControlName]="field.name"
                [label]="field.label"
                [showFraction]="field.meta?.showFraction"
                [showCurrencyToText]="field.meta?.showCurrencyToText"
                [suffix]="field.meta?.suffix"
              ></app-custom-input-number>
              <app-custom-dropdown
                *ngSwitchCase="INPUT_FIELD_TYPE.DROP_DOWN"
                [formControlName]="field.name"
                [options]="field.options"
                [label]="field.label"
              ></app-custom-dropdown>
              <app-custom-switch
                *ngSwitchCase="INPUT_FIELD_TYPE.SWITCH"
                [formControlName]="field.name"
                [label]="field.label"
              ></app-custom-switch>
              <app-custom-jalali-date-picker
                *ngSwitchCase="INPUT_FIELD_TYPE.JALALI_DATE_PICKER"
                [formControlName]="field.name"
                [label]="field.label"
                [timeEnable]="field.meta?.timeEnable"
              ></app-custom-jalali-date-picker>
              <app-custom-georgian-date-picker
                *ngSwitchCase="INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER"
                [formControlName]="field.name"
                [label]="field.label"
                [timeEnable]="field.meta?.timeEnable"
              ></app-custom-georgian-date-picker>
              <app-custom-text-area
                *ngSwitchCase="INPUT_FIELD_TYPE.TEXT_AREA"
                [formControlName]="field.name"
                [label]="field.label"
              ></app-custom-text-area>
              <app-custom-lookup-form
                *ngSwitchCase="INPUT_FIELD_TYPE.LOOK_UP_WITH_FORM"
                [formControlName]="field.name"
                [field]="field.meta?.field"
              ></app-custom-lookup-form>
              <app-custom-upload-file
                *ngSwitchCase="INPUT_FIELD_TYPE.IMAGE || INPUT_FIELD_TYPE.FILE"
                [formControlName]="field.name"
              ></app-custom-upload-file>
            </ng-container>
          </div>
          <p-divider class="w-full" *ngIf="groups.length -1 !== index"></p-divider>
        </div>
        <div class="flex flex-row-reverse">
          <app-custom-button
            label="ثیت"
            icon="pi pi-check"
            [disabled]="dynamicFormGroup.invalid"
          ></app-custom-button>
        </div>
      </form>

    </app-custom-card>

  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {

  @Input() label: string = 'عنوان'
  @Input() model: dynamicField[][] = [];
  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>()

  dynamicFormGroup: FormGroup;
  groups = [];

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
    this.model.forEach(group => {
      const groupArr = []
      group.forEach(field => {
        formGroupFields[field.name] = this.fb.control({
          value: field.value ?? null,
          disabled: field.disabled
        }, DynamicFormComponent.addValidators(field.rules));
        groupArr.push(field);
      })
      this.groups.push(groupArr);
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
        validators.push(Validators.required)
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

  handleCalculateCol(type) {
    switch (type) {
      case INPUT_FIELD_TYPE.TEXT_AREA :
        return 'col-12'
      case INPUT_FIELD_TYPE.IMAGE || INPUT_FIELD_TYPE.FILE :
        return 'col-6'
      default :
        return 'col-3'
    }
  }

}

@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    CustomInputTextModule,
    CustomInputNumberModule,
    CustomDropdownModule,
    CustomJalaliDatePickerModule,
    CustomSwitchModule,
    DividerModule,
    CustomTextAreaModule,
    CustomCardModule,
    CustomButtonModule,
    CustomGeorgianDatePickerModule,
    CustomLookupFormModule,
    CustomUploadFileModule
  ],
  exports: [DynamicFormComponent]
})
export class DynamicFormModule {

}
