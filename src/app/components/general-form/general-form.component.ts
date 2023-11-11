import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {CustomCardModule} from "../../ui-kits/custom-card/custom-card.component";
import {dynamicField, DynamicFormComponent, DynamicFormModule} from "../dynamic-form/dynamic-form.component";
import {CustomButtonModule} from "../../ui-kits/custom-button/custom-button.component";

@Component({
  selector: 'app-general-form',
  template: `
    <app-custom-card>
      <span class="font-md-regular mr-2 text-1">{{label}}</span>
      <p-divider></p-divider>
      <app-dynamic-form #dynamicForm (onSubmit)="onSubmit.emit($event)" [model]="model"></app-dynamic-form>
      <div class="flex flex-row-reverse">
        <app-custom-button
          label="ثیت"
          icon="pi pi-check"
          [disabled]="dynamicForm.dynamicFormGroup.invalid"
          (onClick)="onSubmit.emit(dynamicForm.dynamicFormGroup.getRawValue())"
        ></app-custom-button>
      </div>
    </app-custom-card>
  `,
  styles: []
})
export class GeneralFormComponent implements OnInit {

  @Input() label: string = 'عنوان'
  @Input() model: dynamicField[][]

  @ViewChild('dynamicForm', {read: DynamicFormComponent}) dynamicForm: DynamicFormComponent

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>()

  constructor() {
  }

  ngOnInit(): void {

  }

  handleResetForm() {
    this.dynamicForm.resetForm()
  }

}

@NgModule({
  declarations: [GeneralFormComponent],
  imports: [
    DividerModule,
    CustomCardModule,
    DynamicFormModule,
    CustomButtonModule,
  ],
  exports: [GeneralFormComponent]
})
export class GeneralFormModule {

}
