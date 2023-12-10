import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {MultiSelectModule} from "primeng/multiselect";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {NgClass} from "@angular/common";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";

@Component({
  selector: 'app-custom-multi-select',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <p-multiSelect
        [(ngModel)]="value"
        [options]="options"
        [optionLabel]="optionLabel"
        [optionValue]="optionValue"
        emptyMessage="دیتایی موجود نیست"
        emptyFilterMessage="نتیجه ای یافت نشد"
        [disabled]="disabled"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (onChange)="onChanged($event)"
        (onBlur)="touched()"
      ></p-multiSelect>
    </app-input-wrapper>
  `,
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

      .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox {
        margin-left: 0.5rem;
        margin-right: unset;
      }

    }`]
})
export class CustomMultiSelectComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl;

  @Input() label: string;

  @Input() options: any[];

  @Input() required = false;

  @Input() optionLabel = 'title';

  @Input() optionValue = 'id';

  @Input() class: string;

  @Input() returnObject: boolean = false

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
    if (this.returnObject) {
      const totalValue = []
      value.forEach(val => {
        const option = this.options.find(op => op[this.optionValue] === val)
        totalValue.push({[this.optionValue]: val, [this.optionLabel]: option[this.optionLabel]})
      })
      this.changed(totalValue);
    } else {
      this.changed(value);
    }
  }

}

@NgModule({
  declarations: [CustomMultiSelectComponent],
  imports: [
    MultiSelectModule,
    FormsModule,
    NgClass,
    InputWrapperModule
  ],
  exports: [CustomMultiSelectComponent]
})
export class CustomMultiSelectModule {

}
