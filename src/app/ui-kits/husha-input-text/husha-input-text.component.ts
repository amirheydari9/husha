import {Component, ElementRef, Input, NgModule, OnInit, Renderer2, Self, ViewChild} from '@angular/core';
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {ConvertNumberToEnglishDirectiveModule} from "../../directives/convert-number-to-english.directive";

@Component({
  selector: 'app-husha-input-text',
  template: `
    <div class="flex flex-column gap-2 w-100 uikit-wrapper-height" [ngClass]="class">
      <label class="mb-2 text-1 font-sm-regular">{{label}}</label>
      <input
        type="text"
        [maxLength]="maxLength"
        [convertNumberToEnglish]="true"
        #input
        pInputText
        [value]="value"
        [disabled]="isDisabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (input)="onChanged($event)"
        (blur)="touched()">
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `
})
export class HushaInputTextComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() public label: string;

  @Input() public maxLength: number;

  @Input() public class: string;

  @ViewChild('input') input: ElementRef;

  constructor(
    private renderer: Renderer2,
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
    this.changed(value);
  }

  resetInput(): void {
    this.renderer.setProperty(this.input.nativeElement, 'value', null);
    this.changed(null);
  }

}

@NgModule({
  declarations: [HushaInputTextComponent],
  imports: [
    HushaFieldErrorModule,
    CommonModule,
    InputTextModule,
    ConvertNumberToEnglishDirectiveModule
  ],
  exports: [
    HushaInputTextComponent
  ]
})
export class HushaInputTextModule {

}
