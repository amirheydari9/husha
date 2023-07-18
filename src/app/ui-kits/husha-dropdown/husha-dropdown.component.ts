import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {CommonModule} from "@angular/common";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {HushaFieldErrorModule} from "../husha-field-error/husha-field-error.component";

@Component({
  selector: 'app-husha-dropdown',
  template: `
    <div class="flex flex-column gap-2 w-100" [class]="class">
      <label class="mb-2">{{label}}</label>
      <p-dropdown
        [(ngModel)]="value"
        [showClear]="clearable"
        [autoDisplayFirst]="false"
        [options]="options"
        [optionLabel]="optionLabel"
        [optionValue]="optionValue"
        emptyMessage="دیتایی موجود نیست"
        emptyFilterMessage="نتیجه ای یافت نشد"
        [filter]="filter"
        [filterBy]="optionLabel"
        [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
        [style]="{'width':'100%'}"
        (onChange)="onChanged($event)"
        (onBlur)="touched()">
      </p-dropdown>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>`,
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
export class HushaDropdownComponent extends BaseControlValueAccessor<string> implements OnInit {

  control: FormControl;

  @Input() label: string;

  @Input() clearable = true;

  @Input() options: any[];

  @Input() required = false;

  @Input() optionLabel = 'name';

  @Input() optionValue = 'id';

  @Input() filter = true;

  @Input() class: string;

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
  declarations: [HushaDropdownComponent],
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    HushaFieldErrorModule
  ],
  exports: [HushaDropdownComponent]
})
export class HushaDropdownModule {

}
