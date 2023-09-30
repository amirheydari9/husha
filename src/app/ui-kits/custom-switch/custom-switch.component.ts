import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";

@Component({
  selector: 'app-custom-switch',
  template: `
    <div [class]="class" class="flex align-items-center">
      <p-inputSwitch
        [(ngModel)]="value"
        (onChange)="onChanged($event)"
        [disabled]="disabled"
      ></p-inputSwitch>
      <span class="mr-2 text-1 font-sm-regular">{{label}}</span>
    </div>
  `,
  styles: []
})
export class CustomSwitchComponent extends BaseControlValueAccessor<boolean> implements OnInit {

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
  declarations: [CustomSwitchComponent],
  imports: [
    InputSwitchModule,
    FormsModule
  ],
  exports: [CustomSwitchComponent]
})
export class CustomSwitchModule {

}
