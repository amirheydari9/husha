import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {InputTextareaModule} from "primeng/inputtextarea";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl, Validators} from "@angular/forms";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {CustomValidators} from "../../utils/Custom-Validators";

@Component({
  selector: 'app-husha-text-area',
  template: `
    <div class="flex flex-column gap-2 w-100" [class]="class">
      <label class="mb-2">{{label}}</label>
      <textarea
        pInputTextarea
        [autoResize]="false"
        [value]="value"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [ngStyle]="{'width':'100%'}"
        [rows]="5"
        [cols]="30"
        (input)="onChanged($event)"
        (blur)="touched()"
      ></textarea>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `
})
export class HushaTextAreaComponent extends BaseControlValueAccessor<string> implements OnInit {

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
  declarations: [HushaTextAreaComponent],
  imports: [
    InputTextareaModule,
    HushaFieldErrorModule,
    CommonModule
  ],
  exports: [HushaTextAreaComponent]
})
export class HushaTextAreaModule {

}
