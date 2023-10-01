import {Component, ElementRef, Input, NgModule, OnInit, Self, ViewChild} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormControl, NgControl, ReactiveFormsModule} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {NgClass} from "@angular/common";
import {NgPersianDatepickerModule} from 'ng-persian-datepicker';
import {FieldErrorModule} from "../field-error/field-error.component";
import {CustomValidators} from "../../utils/Custom-Validators";

@Component({
  selector: 'app-custom-date-picker',
  template: `
    <div class="w-full uikit-wrapper-height" [ngClass]="class">
      <ng-persian-datepicker
        [dateInitValue]="!!value"
        [timeEnable]="timeEnable"
        [timeShowSecond]="timeEnable"
        [dateFormat]="timeEnable ? 'YYYY/MM/DD HH:mm:ss' :'YYYY/MM/DD'"
        [dateIsGregorian]="dateIsGregorian"
        [dateGregorianFormat]="timeEnable ? 'YYYY/MM/DD HH:mm:ss' :'YYYY/MM/DD'">
        <span class="p-input-icon-left p-float-label w-full">
            <i class="pi pi-calendar cursor-pointer" (click)="input.focus()"></i>
            <input
              [formControl]="control"
              type="text"
              #input
              pInputText
              [value]="value"
              [disabled]="disabled"
              [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
              [style]="{'width':'100%'}"
              (input)="onChanged($event)"
              (blur)="touched()"/>
          <label class="text-1 font-sm-regular">{{label}}</label>
        </span>
      </ng-persian-datepicker>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles: [`
    :host ::ng-deep .datepicker-outer-container {
      position: fixed;
      z-index: 10000;
    }
  `]
})
export class CustomDatePickerComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl

  @Input() timeEnable = false;

  @Input() clearable = true;

  @Input() class: string;

  @Input() label: string;

  @Input() dateIsGregorian: boolean;

  @ViewChild('datepickerInput', {static: false}) datepickerInput: ElementRef;


  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
    this.control.addValidators([CustomValidators.datePickerFormat(this.timeEnable)])
    this.control.updateValueAndValidity()
  }

  public onChanged(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.changed(!!value ? value : null);
  }

}

@NgModule({
  declarations: [CustomDatePickerComponent],
  imports: [
    InputTextModule,
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    FieldErrorModule,
    NgClass
  ],
  exports: [CustomDatePickerComponent]
})
export class CustomDatePickerModule {

}
