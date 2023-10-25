import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldErrorModule} from "../field-error/field-error.component";
import {ConvertNumberToEnglishDirectiveModule} from "../../directives/convert-number-to-english.directive";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {NgClass, NgStyle} from "@angular/common";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";

@Component({
  selector: 'app-custom-text-area',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class" [isTextArea]="true">
      <textarea
        [convertNumberToEnglish]="true"
        pInputTextarea
        [autoResize]="false"
        [(ngModel)]="value"
        [disabled]="disabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [ngStyle]="{'width':'100%'}"
        [rows]="5"
        [cols]="30"
        (input)="onChanged($event)"
        (blur)="touched()"
      ></textarea>
    </app-input-wrapper>
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
    NgStyle,
    InputWrapperModule,
    FormsModule
  ],
  exports: [CustomTextAreaComponent]
})
export class CustomTextAreaModule {

}
