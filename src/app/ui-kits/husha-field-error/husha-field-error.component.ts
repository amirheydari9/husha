import {Component, Input, NgModule} from '@angular/core';
import {FormControl} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-husha-field-error',
  template: `
    <ul *ngIf="shouldShowErrors()">
      <!--      <li style="list-style: none" class="p-error" *ngFor="let error of listOfErrors()">{{error}}</li>-->
      <li style="list-style: none;font-size: 10px" class="p-error">{{error()}}</li>
    </ul>
  `,
  styles: []
})
export class HushaFieldErrorComponent {

  constructor() {
  }

  @Input()
  public formField: FormControl;

  public readonly errorMessages = {
    required: () => 'This field is required',
    minlength: (params) => 'The min number of characters is ' + params.requiredLength,
    maxlength: (params) => 'The max allowed number of characters is ' + params.requiredLength,
    pattern: (params) => 'The required pattern is: ' + params.requiredPattern,
    nationalCode: (params) => params.message,
    noWhitespace: (params) => params.message,
    authPassword: (params) => params.message,
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
  declarations: [HushaFieldErrorComponent],
  imports: [
    CommonModule
  ],
  exports: [HushaFieldErrorComponent]
})
export class HushaFieldErrorModule {

}
