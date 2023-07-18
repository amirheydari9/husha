import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl, Validators} from "@angular/forms";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {CustomValidators} from "../../utils/Custom-Validators";

@Component({
  selector: 'app-husha-input-number',
  template: `
    <div class="flex flex-column gap-2 w-100" [ngClass]="class">
      <label class="mb-2">{{label}}</label>
      <p-inputNumber
        #inputNumber
        [(ngModel)]="value"
        [format]="format"
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
      ></p-inputNumber>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `
})
export class HushaInputNumberComponent extends BaseControlValueAccessor<number> implements OnInit {

  control: FormControl

  @Input() label: string;

  @Input() min: number;

  @Input() max: number;

  @Input() format = false;

  @Input() maxlength: number;

  @Input() minFractionDigits: number;

  @Input() maxFractionDigits: number;

  @Input() class: string;

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
    if (this.control.hasValidator(Validators.required)) {
      this.control.addValidators(CustomValidators.noWhitespace)
    }
  }

  onChanged($event: any): void {
    const {value} = $event;
    this.changed(value);
  }
}

@NgModule({
  declarations: [HushaInputNumberComponent],
  imports: [
    HushaFieldErrorModule,
    CommonModule,
    InputNumberModule,
    FormsModule
  ],
  exports: [HushaInputNumberComponent]
})
export class HushaInputNumberModule {

}
