import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {CommonModule, NgClass, NgStyle} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";
import {NumberToCurrencyPipeModule} from "../../pipes/number-to-currency.pipe";

@Component({
  selector: 'app-custom-input-number',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <p-inputNumber
        #inputNumber
        [(ngModel)]="value"
        [format]="format"
        [disabled]="disabled"
        [min]="min"
        [max]="max"
        [maxlength]="maxlength"
        [minFractionDigits]="minFractionDigits"
        [maxFractionDigits]="maxFractionDigits"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [ngStyle]="{'width':'100%'}"
        [style]="{'width':'100%'}"
        (onInput)="onChanged($event)"
        (onBlur)="touched()"
        [inputStyle]="{'width':'100%'}"
        [suffix]="suffix"
      ></p-inputNumber>
      <span hint *ngIf="showCurrencyToText && !showFraction" class="text-1 font-xs-regular">{{control.value| numberToCurrency}}</span>
    </app-input-wrapper>
  `,
})
export class CustomInputNumberComponent extends BaseControlValueAccessor<number> implements OnInit {

  control: FormControl

  @Input() label: string;

  @Input() min: number;

  @Input() max: number;

  @Input() format = true;

  @Input() maxlength: number;

  @Input() class: string;

  @Input() suffix: string;

  @Input() showCurrencyToText: boolean;

  minFractionDigits: number;

  maxFractionDigits: number;

  private _showFraction: boolean
  @Input() set showFraction(value: boolean) {
    if (value) {
      this.minFractionDigits = 1
      this.maxFractionDigits = 5
    }
    this._showFraction = value
  };

  get showFraction(): boolean {
    return this._showFraction
  }

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  onChanged($event: any): void {
    const {value} = $event;
    this.changed(!!value ? value : null);
  }
}

@NgModule({
  declarations: [CustomInputNumberComponent],
  imports: [
    InputNumberModule,
    FormsModule,
    NgClass,
    NgStyle,
    InputWrapperModule,
    NumberToCurrencyPipeModule,
    CommonModule
  ],
  exports: [CustomInputNumberComponent]
})
export class CustomInputNumberModule {

}
