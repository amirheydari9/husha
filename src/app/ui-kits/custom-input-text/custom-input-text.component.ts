import {Component, ElementRef, Input, NgModule, OnInit, Self, ViewChild} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {ConvertNumberToEnglishDirectiveModule} from "../../directives/convert-number-to-english.directive";
import {InputTextModule} from "primeng/inputtext";
import {NgClass} from "@angular/common";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";

@Component({
  selector: 'app-custom-input-text',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <input
        type="text"
        [convertNumberToEnglish]="true"
        #input
        pInputText
        [(ngModel)]="value"
        [disabled]="disabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (input)="onChanged($event)"
        (blur)="touched()">
    </app-input-wrapper>
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
    InputTextModule,
    ConvertNumberToEnglishDirectiveModule,
    NgClass,
    InputWrapperModule,
    FormsModule,
  ],
  exports: [
    CustomInputTextComponent
  ]
})
export class CustomInputTextModule {

}
