import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";
import {DialogManagementService} from "../../utils/dialog-management.service";

@Component({
  selector: 'app-custom-lookup-form',
  template: `
    app-custom-lookup-form
    <i class="pi pi-table" (click)="handleOpenDialog()"></i>
  `,
  styles: [],
})
export class CustomLookupFormComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl

  @Input() public label: string;
  @Input() public field: IFormField

  constructor(
    @Self() public controlDir: NgControl,
    private dialogManagementService: DialogManagementService
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

  handleOpenDialog() {
    this.dialogManagementService.openDialog(LookupFormDialogComponent, {data: {field: this.field}}).subscribe(data => {

    })
  }
}


@NgModule({
  declarations: [CustomLookupFormComponent, LookupFormDialogComponent],
  imports: [],
  exports: [CustomLookupFormComponent],
  entryComponents: [LookupFormDialogComponent]
})

export class CustomLookupFormModule {

}
