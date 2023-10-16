import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";
import {IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";
import {CustomDialogModule} from "../custom-dialog/custom-dialog.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-custom-lookup-form',
  template: `
    app-custom-lookup-form
    <i class="pi pi-table" (click)="showDialog=true"></i>
    <app-lookup-form-dialog
      *ngIf="showDialog"
      [(visible)]="showDialog"
      [field]="field"
    ></app-lookup-form-dialog>
  `,
  styles: [],
})
export class CustomLookupFormComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl
  showDialog: boolean = false

  @Input() public field: IFormField

  constructor(
    @Self() public controlDir: NgControl,
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
  }

}

@NgModule({
  declarations: [CustomLookupFormComponent, LookupFormDialogComponent],
  imports: [
    CustomDialogModule,
    NgIf
  ],
  exports: [CustomLookupFormComponent],
  entryComponents: [LookupFormDialogComponent]
})

export class CustomLookupFormModule {

}
