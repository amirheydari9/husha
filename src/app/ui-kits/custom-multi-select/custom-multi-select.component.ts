import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {MultiSelectModule} from "primeng/multiselect";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {NgClass} from "@angular/common";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FieldErrorModule} from "../field-error/field-error.component";

@Component({
  selector: 'app-custom-multi-select',
  template: `
    <div class="uikit-wrapper-height w-full" [class]="class">
     <span class="p-float-label">
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
       <label class="mb-2 text-1 font-sm-regular">{{label}}</label>
     </span>
      <app-field-error [formField]="control"></app-field-error>
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
export class CustomMultiSelectComponent extends BaseControlValueAccessor<any> implements OnInit {

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
  declarations: [CustomMultiSelectComponent],
  imports: [
    MultiSelectModule,
    FormsModule,
    FieldErrorModule,
    NgClass
  ],
  exports: [CustomMultiSelectComponent]
})
export class CustomMultiSelectModule {

}
