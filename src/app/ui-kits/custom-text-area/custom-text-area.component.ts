import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldErrorModule} from "../field-error/field-error.component";
import {ConvertNumberToEnglishDirectiveModule} from "../../directives/convert-number-to-english.directive";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-custom-text-area',
  template: `
    <div class="flex flex-column" [class]="class">
      <span class="p-float-label">
      <textarea
        [convertNumberToEnglish]="true"
        pInputTextarea
        [autoResize]="false"
        [value]="value"
        [disabled]="disabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [ngStyle]="{'width':'100%'}"
        [rows]="5"
        [cols]="30"
        (input)="onChanged($event)"
        (blur)="touched()"
      ></textarea>
       <label class="text-1 font-sm-regular">{{label}}</label>
      </span>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `
})
export class CustomTextAreaComponent extends BaseControlValueAccessor<string> implements OnInit {
  control: FormControl;

  @Input() public label: string;
  @Input() public class: string;

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
    const value = $event.target.value;
    this.changed(value);
  }
}

@NgModule({
  declarations: [CustomTextAreaComponent],
  imports: [
    InputTextareaModule,
    FieldErrorModule,
    ConvertNumberToEnglishDirectiveModule,
    NgClass,
    NgStyle
  ],
  exports: [CustomTextAreaComponent]
})
export class CustomTextAreaModule {

}
