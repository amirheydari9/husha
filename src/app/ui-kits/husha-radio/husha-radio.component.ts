import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";

export interface RadioOption {
  label: string;
  value: number | string | boolean;
}

@Component({
  selector: 'app-husha-radio',
  template: `
    <div class="field-radiobutton">
      <ng-container *ngFor="let option of options" class="field-checkbox">
        <p-radioButton
          [value]="option.value"
          [(ngModel)]="value"
          [label]="option.label"
          (onClick)="handleChanged($event)"
        ></p-radioButton>
      </ng-container>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>
  `
})
export class HushaRadioComponent extends BaseControlValueAccessor<number | string | boolean> implements OnInit {

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
  declarations: [HushaRadioComponent],
  imports: [
    RadioButtonModule,
    CommonModule,
    FormsModule,
    HushaFieldErrorModule
  ],
  exports: [HushaRadioComponent]
})
export class HushaRadioModule {

}
