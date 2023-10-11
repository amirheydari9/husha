import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";

@Component({
  selector: 'app-custom-lookup-form',
  template: `
    app-custom-lookup-form
  `,
  styles: []
})
export class CustomLookupFormComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl

  @Input() public label: string;
  @Input() public form: IFetchFormRes
  @Input() public field: IFormField

  constructor(
    @Self() public controlDir: NgControl
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  handleShowForm() {

  }

}


@NgModule({
  declarations: [CustomLookupFormComponent, LookupFormDialogComponent],
  imports: [],
  exports: [CustomLookupFormComponent]
})

export class CustomLookupFormModule {

}
