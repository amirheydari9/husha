import {Component, Input, NgModule} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-field-error',
  template: `
    <ul *ngIf="shouldShowErrors()">
      <!--      <li style="list-style: none" class="p-error" *ngFor="let error of listOfErrors()">{{error}}</li>-->
      <li style="list-style: none" class="font-xs-regular text-forbidden">{{error()}}</li>
    </ul>
  `,
  styles: []
})
export class FieldErrorComponent {

  @Input() public formField: FormControl;

  public readonly errorMessages = {
    required: () => 'این فیلد اجباری است',
    minlength: (params) => `حداقل ${params.requiredLength} کارکتر وارد نمایید`,
    maxlength: (params) => `حداکثر ${params.requiredLength} کارکتر وارد نمایید`,
    min: (params) => `مقدار این فیلد نمی تواند کمتر از${params.min} باشد`,
    max: (params) => `مقدار این فیلد نمی تواند بیشتر از${params.max} باشد`,
    pattern: (params) => 'The required pattern is: ' + params.requiredPattern,
    nationalCode: (params) => params.message,
    noWhitespace: (params) => params.message,
    authPassword: (params) => params.message,
    mobile: (params) => params.message,
    datePickerFormat: (params) => params.message,
  };

  shouldShowErrors(): boolean {
    return this.formField && this.formField.errors && (this.formField.dirty || this.formField.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.formField.errors)
      .map(field => this.getMessage(field, this.formField.errors[field]));
  }

  error(): string {
    return Object.keys(this.formField.errors)
      .map(field => this.getMessage(field, this.formField.errors[field]))[0];
  }

  getMessage(type: string, params: any): string {
    return this.errorMessages[type](params);
  }
}

@NgModule({
  declarations: [FieldErrorComponent],
  imports: [
    NgIf
  ],
  exports: [FieldErrorComponent]
})
export class FieldErrorModule {

}
