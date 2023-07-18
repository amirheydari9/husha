import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnInit,
  Renderer2,
  Self,
  ViewChild
} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";
import {FormControl, NgControl} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {CommonModule} from "@angular/common";
import {NgPersianDatepickerModule} from 'ng-persian-datepicker';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-husha-date-picker',
  template: `
    <div class="flex flex-column gap-2 w-100" [ngClass]="class">
      <label class="mb-2">{{label}}</label>
      <ng-persian-datepicker [dateInitValue]="!!value">
        <input
          readonly
          [formControl]="control"
          type="text"
          #input
          pInputText
          [value]="value"
          [disabled]="isDisabled"
          [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
          [style]="{'width':'100%'}"
          (input)="onChanged($event)"
          (blur)="touched()">
      </ng-persian-datepicker>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `,
  styleUrls: ['./husha-date-picker.component.scss']
})
export class HushaDatePickerComponent extends BaseControlValueAccessor<string> implements OnInit, AfterContentChecked {

  control: FormControl

  @Input() timeEnable = false;

  @Input() clearable = true;

  @Input() class: string;

  @Input() label: string;

  @ViewChild('datepickerInput', {static: false}) datepickerInput: ElementRef;


  constructor(
    private renderer: Renderer2,
    @Self() public controlDir: NgControl,
    private ref: ChangeDetectorRef
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  public onChanged(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.changed(value);
  }

  resetInput(): void {
    this.renderer.setProperty(this.datepickerInput.nativeElement, 'value', '');
    this.changed('');
  }

}

@NgModule({
  declarations: [HushaDatePickerComponent],
  imports: [
    InputTextModule,
    HushaFieldErrorModule,
    CommonModule,
    NgPersianDatepickerModule,
    ReactiveFormsModule
  ],
  exports: [HushaDatePickerComponent]
})
export class HushaDatePickerModule {

}
