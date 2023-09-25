import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";

@Component({
  selector: 'app-custom-tri-checkbox',
  template: `
    <div [class]="class">
      <p-triStateCheckbox
        [(ngModel)]="value"
        [label]="label"
        (onChange)="onChanged($event)"
        [disabled]="disabled"
      ></p-triStateCheckbox>
    </div>
  `,
  styles: [`
    ::ng-deep .p-checkbox-label {
      margin-right: 0.5rem;
      font-size: 14px;
    }
  `]
})
export class CustomTriCheckboxComponent extends BaseControlValueAccessor<boolean | null> implements OnInit {

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
    const {value} = $event;
    this.changed(value);
  }
}

@NgModule({
  declarations: [CustomTriCheckboxComponent],
  imports: [
    FormsModule,
    TriStateCheckboxModule
  ],
  exports: [CustomTriCheckboxComponent]
})
export class CustomTriCheckboxModule {

}
