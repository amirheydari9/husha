import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {CheckboxModule} from "primeng/checkbox";
import {FormArray, FormControl, NgControl} from "@angular/forms";
import {CommonModule} from "@angular/common";

export interface CheckboxGroupOption {
  label: string;
  value: number | string | boolean;
}


@Component({
  selector: 'app-husha-checkbox-group',
  template: `
    <ng-container *ngFor="let option of options; let i=index">
      <label>
        <input type="checkbox" [value]="option.value" (change)="onCheckChange($event)">
        {{option.label}}
      </label>
    </ng-container>`,
})
export class HushaCheckboxGroupComponent extends BaseControlValueAccessor<number[] | string[] | boolean[]> implements OnInit {

  control: FormArray

  @Input() public label: string;

  @Input() public options: CheckboxGroupOption[];

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormArray;
  }

  onCheckChange($event: Event): void {
    /* Selected */
    if ($event.target['checked']) {
      // Add a new control in the arrayForm
      this.control.push(new FormControl($event.target['value']));
    }
    /* unselected */
    else {
      // find the unselected element
      this.control.controls.forEach((ctrl: FormControl, index) => {
        if (ctrl.value === $event.target['value']) {
          // Remove the unselected element from the arrayForm
          this.control.removeAt(index);
          return;
        }
      });
    }
  }


}

@NgModule({
  declarations: [HushaCheckboxGroupComponent],
  imports: [CommonModule, CheckboxModule],
  exports: [HushaCheckboxGroupComponent]
})

export class HushaCheckboxGroupModule {

}
