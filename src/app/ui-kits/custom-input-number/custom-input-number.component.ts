import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {FieldErrorModule} from "../field-error/field-error.component";

@Component({
  selector: 'app-custom-input-number',
  template: `
    <div class="uikit-wrapper-height" [ngClass]="class">
     <span class="p-float-label">
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
         ></p-inputNumber>
       <label class="text-1 font-sm-regular">{{label}}</label>
     </span>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-inputnumber-input {
      width: 100%;
    }
  `]
})
export class CustomInputNumberComponent extends BaseControlValueAccessor<number> implements OnInit {

  control: FormControl

  @Input() label: string;

  @Input() min: number;

  @Input() max: number;

  @Input() format = true;

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
  }

  onChanged($event: any): void {
    const {value} = $event;
    this.changed(!!value ? value : null);
  }
}

@NgModule({
  declarations: [CustomInputNumberComponent],
  imports: [
    FieldErrorModule,
    InputNumberModule,
    FormsModule,
    NgClass,
    NgStyle
  ],
  exports: [CustomInputNumberComponent]
})
export class CustomInputNumberModule {

}
