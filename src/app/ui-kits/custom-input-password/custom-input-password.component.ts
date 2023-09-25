import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {PasswordModule} from "primeng/password";
import {NgClass, NgStyle} from "@angular/common";
import {FieldErrorModule} from "../field-error/field-error.component";

@Component({
  selector: 'app-custom-input-password',
  template: `
    <div class="w-full uikit-wrapper-height" [ngClass]="class">
     <span class="p-float-label">
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
      <label class="text-1 font-sm-regular">{{label}}</label>
     </span>
      <app-field-error [formField]="control"></app-field-error>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-input-icon-right {
      > i:last-of-type {
        left: 0.75rem;
        right: unset;
      }

      > .p-inputtext {
        padding-left: 2.5rem;
        padding-right: 0.75rem;
      }
    }
  `]
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
    FieldErrorModule,
    FormsModule,
    NgClass,
    NgStyle
  ],
  exports: [
    CustomInputPasswordComponent
  ]
})
export class CustomInputPasswordModule {

}
