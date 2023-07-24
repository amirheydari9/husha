import {Component, ElementRef, Input, NgModule, OnInit, Renderer2, Self, ViewChild} from '@angular/core';
import {FormControl, FormsModule, NgControl, Validators} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {PasswordModule} from "primeng/password";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {CustomValidators} from "../../utils/Custom-Validators";

@Component({
  selector: 'app-husha-input-password',
  template: `
    <div class="flex flex-column gap-2 w-100 uikit-wrapper-height" [ngClass]="class">
      <label class="mb-2">{{label}}</label>
      <p-password
        #input
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
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `
})
export class HushaInputPasswordComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() public label: string;

  @Input() public class: string;

  @ViewChild('input') input: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
    this.control.addValidators(CustomValidators.authPassword)
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
  declarations: [HushaInputPasswordComponent],
  imports: [
    PasswordModule,
    HushaFieldErrorModule,
    FormsModule,
    CommonModule,
    InputTextModule
  ],
  exports: [
    HushaInputPasswordComponent
  ]
})
export class HushaInputPasswordModule {

}
