import {Component, Input, NgModule} from '@angular/core';
import {FieldErrorModule} from "../field-error/field-error.component";
import {FormControl} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-input-wrapper',
  template: `
    <div [className]="[isTextArea ? 'uikit-wrapper-textarea-height':'uikit-wrapper-height']">
      <span class="p-float-label">
        <ng-content></ng-content>
        <label class="text-1 font-sm-regular">{{label}}</label>
      </span>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles: []
})
export class InputWrapperComponent {

  @Input() control: FormControl
  @Input() label: string;
  @Input() isTextArea: boolean = false

  constructor() {
  }

}

@NgModule({
  declarations: [InputWrapperComponent],
  imports: [
    FieldErrorModule,
    NgClass,
    CommonModule
  ],
  exports: [
    InputWrapperComponent
  ]
})
export class InputWrapperModule {

}
