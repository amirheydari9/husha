import {Component, ElementRef, Input, NgModule, OnInit, Renderer2, Self, ViewChild} from '@angular/core';
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {PasswordModule} from "primeng/password";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-husha-input-password',
  templateUrl: './husha-input-password.component.html',
  styleUrls: ['./husha-input-password.component.scss']
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
