import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";
import {NgClass, NgStyle} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {CustomValidators} from "../../utils/Custom-Validators";
import {DateService} from "../../utils/date.service";

@Component({
  selector: 'app-custom-georgian-date-picker',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <p-calendar
        [showIcon]="true"
        [ngModel]="value"
        [showTime]="timeEnable"
        [showSeconds]="timeEnable"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [inputStyle]="{'width':'100%'}"
        [ngStyle]="{'width':'100%'}"
        [style]="{'width':'100%'}"
        (onSelect)="onChanged($event)"
        (onBlur)="touched()"
        dateFormat="yy/mm/dd"
        hourFormat="HH:mm:ss"
      ></p-calendar>
    </app-input-wrapper>
  `,
  styles: [`
    :host ::ng-deep .p-calendar-w-btn {
      .p-inputtext {
        border-radius: 0 6px 6px 0;
      }

      .p-datepicker-trigger {
        border-radius: 6px 0 0 6px;
      }
    }
  `]
})
export class CustomGeorgianDatePickerComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() timeEnable = false;

  @Input() clearable = true;

  @Input() class: string;

  @Input() label: string;


  constructor(
    @Self() public controlDir: NgControl,
    private dateService: DateService
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }


  ngOnInit() {
    this.control = this.controlDir.control as FormControl
    this.control.addValidators([CustomValidators.datePickerFormat(this.timeEnable)])
    this.control.updateValueAndValidity()
  }

  onChanged($event: any) {
    this.changed(!!$event ? this.dateService.formatDate($event,this.timeEnable ? 'YYYY/MM/DD HH:mm:ss':'YYYY/MM/DD') : null);
  }
}

@NgModule({
  declarations: [CustomGeorgianDatePickerComponent],
  imports: [
    InputWrapperModule,
    NgClass,
    NgStyle,
    CalendarModule,
    FormsModule
  ],
  exports: [CustomGeorgianDatePickerComponent]
})
export class CustomGeorgianDatePickerModule {

}
