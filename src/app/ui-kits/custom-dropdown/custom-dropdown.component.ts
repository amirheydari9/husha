import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {NgClass} from "@angular/common";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";

@Component({
  selector: 'app-custom-dropdown',
  template: `
    <app-input-wrapper [label]="label" [control]="control" [ngClass]="class">
      <p-dropdown
        [appendTo]="appendTo??''"
        [(ngModel)]="value"
        [showClear]="showClear"
        [autoDisplayFirst]="false"
        [options]="options"
        [optionLabel]="optionLabel"
        [optionValue]="optionValue"
        [disabled]="disabled"
        emptyMessage="دیتایی موجود نیست"
        emptyFilterMessage="نتیجه ای یافت نشد"
        [filter]="filter"
        [filterBy]="optionLabel"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (onChange)="onChanged($event)"
        (onBlur)="touched()">
      </p-dropdown>
    </app-input-wrapper>`,
  styles: [`
    :host ::ng-deep .p-dropdown {

      & .p-dropdown-clear-icon {
        left: 2.357rem;
        right: unset
      }

      &.p-dropdown-clearable .p-dropdown-label {
        padding-right: 0.5rem;
      }

      & .p-dropdown-panel .p-dropdown-header .p-dropdown-filter {
        margin-right: unset;
      }
    }
  `]
})
export class CustomDropdownComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() label: string;

  @Input() showClear = true;

  @Input() options: any[];

  @Input() required = false;

  @Input() optionLabel = 'name';

  @Input() optionValue = 'id';

  @Input() filter = true;

  @Input() class: string;

  @Input() appendTo: string;

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  public onChanged(event: any): void {
    const value: string = event.value;
    this.changed(value);
  }

}

@NgModule({
  declarations: [CustomDropdownComponent],
  imports: [
    DropdownModule,
    FormsModule,
    NgClass,
    InputWrapperModule
  ],
  exports: [CustomDropdownComponent]
})
export class CustomDropdownModule {

}
