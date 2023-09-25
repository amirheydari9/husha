import {Component, ElementRef, Input, NgModule, OnInit, Self, ViewChild} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {ConvertNumberToEnglishDirectiveModule} from "../../directives/convert-number-to-english.directive";
import {InputTextModule} from "primeng/inputtext";
import {FieldErrorModule} from "../field-error/field-error.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-custom-input-text',
  template: `
    <div class="uikit-wrapper-height" [ngClass]="class">
      <span class="p-float-label">
        <input
          type="text"
          [convertNumberToEnglish]="true"
          #input
          pInputText
          [value]="value"
          [disabled]="disabled"
          [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
          [style]="{'width':'100%'}"
          (input)="onChanged($event)"
          (blur)="touched()">
        <label class="text-1 font-sm-regular">{{label}}</label>
      </span>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles: []
})
export class CustomInputTextComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() public label: string;

  @Input() public maxLength: number;

  @Input() public class: string;

  @ViewChild('input') input: ElementRef;

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

  public onChanged(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.changed(!!value ? value : null);
  }
}

@NgModule({
  declarations: [CustomInputTextComponent],
  imports: [
    FieldErrorModule,
    InputTextModule,
    ConvertNumberToEnglishDirectiveModule,
    NgClass
  ],
  exports: [
    CustomInputTextComponent
  ]
})
export class CustomInputTextModule {

}
