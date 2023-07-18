import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {MultiSelectModule} from "primeng/multiselect";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";

@Component({
  selector: 'app-husha-multi-select',
  template: `
    <div class="flex flex-column gap-2 w-100" [class]="class">
      <label class="mb-2">{{label}}</label>
      <p-multiSelect
        [(ngModel)]="value"
        [options]="options"
        [optionLabel]="optionLabel"
        [optionValue]="optionValue"
        display="chip"
        emptyMessage="دیتایی موجود نیست"
        emptyFilterMessage="نتیجه ای یافت نشد"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (onChange)="onChanged($event)"
        (onBlur)="touched()"
      ></p-multiSelect>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>`,
  styles: [`
    :host ::ng-deep .p-multiselect.p-component {
      .p-multiselect-header {
        .p-multiselect-close {
          margin-left: unset;
          margin-right: 0.5rem;
        }
        .p-checkbox {
          margin-left: 0.5rem;
          margin-right: unset;
        }
      }
    }`]
})
export class HushaMultiSelectComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl;

  @Input() label: string;

  @Input() options: any[];

  @Input() required = false;

  @Input() optionLabel = 'name';

  @Input() optionValue = 'id';

  @Input() class: string;

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  public onChanged(event: any): void {
    const value: any[] = event.value;
    this.changed(value);
  }

}

@NgModule({
  declarations: [HushaMultiSelectComponent],
  imports: [
    MultiSelectModule,
    FormsModule,
    CommonModule,
    HushaFieldErrorModule
  ],
  exports: [HushaMultiSelectComponent]
})
export class HushaMultiSelectModule {

}
