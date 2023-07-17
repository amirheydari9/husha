import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";

@Component({
  selector: 'app-husha-checkbox',
  template: `
    <div [class]="class">
      <p-checkbox
        [label]="label"
        [(ngModel)]="value"
        [binary]="true"
        (onChange)="onChanged($event)"
      ></p-checkbox>
    </div>
  `,
})
export class HushaCheckboxComponent extends BaseControlValueAccessor<boolean> implements OnInit {

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
  declarations: [HushaCheckboxComponent],
  imports: [
    CheckboxModule,
    FormsModule
  ],
  exports: [HushaCheckboxComponent]
})
export class HushaCheckboxModule {

}
