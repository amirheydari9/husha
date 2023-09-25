import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";

@Component({
  selector: 'app-custom-checkbox',
  template: `
    <div [class]="class">
      <p-checkbox
        [label]="label"
        [(ngModel)]="value"
        [binary]="true"
        (onChange)="onChanged($event)"
        [disabled]="disabled"
      ></p-checkbox>
    </div>
  `,
  styles: [`
    ::ng-deep .p-checkbox-label {
      margin-right: 0.5rem;
      font-size: 14px;
    }
  `]
})
export class CustomCheckboxComponent extends BaseControlValueAccessor<boolean> implements OnInit {

  control: FormControl

  @Input() public label: string;
  @Input() public class: string;

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  onChanged($event: any): void {
    const {checked} = $event;
    this.changed(checked);
  }

}

@NgModule({
  declarations: [CustomCheckboxComponent],
  imports: [
    CheckboxModule,
    FormsModule
  ],
  exports: [CustomCheckboxComponent]
})
export class CustomCheckboxModule {

}
