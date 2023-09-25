import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {FieldErrorModule} from "../field-error/field-error.component";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {NgForOf} from "@angular/common";

export interface RadioOption {
  label: string;
  value: number | string | boolean;
}

@Component({
  selector: 'app-custom-radio',
  template: `
    <div class="field-radiobutton">
      <ng-container *ngFor="let option of options" class="field-checkbox">
        <p-radioButton
          [disabled]="disabled"
          [value]="option.value"
          [(ngModel)]="value"
          [label]="option.label"
          (onClick)="handleChanged($event)"
        ></p-radioButton>
      </ng-container>
      <app-field-error [formField]="control"></app-field-error>
    </div>
  `,
  styles:[`
    :host ::ng-deep .p-radiobutton-label {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  `]
})
export class CustomRadioComponent extends BaseControlValueAccessor<number | string | boolean> implements OnInit {

  control: FormControl

  @Input() public label: string;
  @Input() public options: RadioOption[];

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  handleChanged($event: any): void {
    this.changed(this.value);
  }

}

@NgModule({
  declarations: [CustomRadioComponent],
  imports: [
    RadioButtonModule,
    FormsModule,
    FieldErrorModule,
    NgForOf
  ],
  exports: [CustomRadioComponent]
})
export class CustomRadioModule {

}
