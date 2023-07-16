import {Component, ElementRef, Input, NgModule, OnInit, Renderer2, Self, ViewChild} from '@angular/core';
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";

@Component({
  selector: 'app-husha-input-text',
  templateUrl: './husha-input-text.component.html',
  styleUrls: ['./husha-input-text.component.scss'],
})
export class HushaInputTextComponent extends BaseControlValueAccessor<string> implements OnInit {

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

  ngOnInit() {
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
  declarations: [HushaInputTextComponent],
  imports: [
    HushaFieldErrorModule,
    CommonModule,
    InputTextModule
  ],
  exports: [
    HushaInputTextComponent
  ]
})
export class HushaInputTextModule {

}
