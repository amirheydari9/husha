import {Component, Input, NgModule, Self} from '@angular/core';
import {PickListModule} from "primeng/picklist";
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";

@Component({
  selector: 'app-custom-pick-list',
  template: `
    <p-pickList
      dir="ltr"
      (onMoveToTarget)="handleOnChange($event)"
      (onMoveToSource)="handleOnChange($event)"
      (onMoveAllToSource)="handleOnChange($event)"
      (onMoveAllToTarget)="handleOnChange($event)"
      [source]="source"
      [target]="value"
      filterBy="headerName"
      sourceHeader="لیست ستون ها"
      targetHeader="اتتخاب شده"
      [dragdrop]="true"
      [responsive]="false"
      [sourceStyle]="{ height: '20rem' }"
      [targetStyle]="{ height: '20rem' }"
      breakpoint="1400px">
      <ng-template let-column pTemplate="item">
        {{column['headerName']}}
      </ng-template>
    </p-pickList>`,
  styles: [`
    :host ::ng-deep {
      .p-picklist-header {
        text-align: right;
      }

      .p-picklist {
        .p-picklist-list {
          text-align: end;
        }

        .p-picklist-filter-container .p-picklist-filter-input {
          text-align: right;
          padding-right: 2rem;
        }
      }
    }
  `]
})
export class CustomPickListComponent extends BaseControlValueAccessor<any[]> {

  control: FormControl
  @Input() source = []

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }

  handleOnChange($event: any) {
    this.changed(this.value)
    this.touched()
  }
}


@NgModule({
  declarations: [CustomPickListComponent],
  imports: [
    PickListModule
  ],
  exports: [CustomPickListComponent]
})
export class CustomPickListModule {

}
