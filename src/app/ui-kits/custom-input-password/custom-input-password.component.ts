import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {PasswordModule} from "primeng/password";
import {NgClass, NgStyle} from "@angular/common";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";

@Component({
  selector: 'app-custom-input-password',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <p-password
        [toggleMask]="true"
        [feedback]="false"
        [(ngModel)]="value"
        [disabled]="isDisabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [inputStyle]="{'width':'100%'}"
        [style]="{'width':'100%'}"
        [ngStyle]="{'width':'100%'}"
        (input)="onChanged($event)"
        (onBlur)="touched()"
      ></p-password>
    </app-input-wrapper>
    <ng-content></ng-content>
  `,
  styles: [``]
})
export class CustomInputPasswordComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() public label: string;

  @Input() public class: string;

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  public onChanged(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.changed(!!value ? value : null);
  }

}

@NgModule({
  declarations: [CustomInputPasswordComponent],
  imports: [
    PasswordModule,
    FormsModule,
    NgClass,
    NgStyle,
    InputWrapperModule
  ],
  exports: [
    CustomInputPasswordComponent
  ]
})
export class CustomInputPasswordModule {

}
