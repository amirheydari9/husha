import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, NgControl} from "@angular/forms";
import {IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";
import {CustomDialogModule} from "../custom-dialog/custom-dialog.component";
import {NgClass, NgIf} from "@angular/common";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";
import {InputTextModule} from "primeng/inputtext";
import {CustomButtonModule} from "../custom-button/custom-button.component";

@Component({
  selector: 'app-custom-lookup-form',
  template: `
    <div class="flex align-items-stretch">
      <app-custom-button
        [class]="'ml-2'"
        [icon]="'pi pi-table'"
        (onClick)="showDialog = true"
      ></app-custom-button>
      <div class="flex-grow-1">
        <app-input-wrapper [label]="field.caption" [control]="control">
          <input
            type="text"
            readonly
            #input
            pInputText
            [value]="value"
            [disabled]="disabled"
            [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
            [style]="{'width':'100%'}"
            (blur)="touched()">
        </app-input-wrapper>
      </div>
    </div>
    <app-lookup-form-dialog
      *ngIf="showDialog"
      [(visible)]="showDialog"
      [field]="field"
      (onHide)="handleOnHide($event)"
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

  handleOnHide($event: any) {
    this.changed($event.id)
    this.writeValue(`${$event.code} - ${$event.title}`)
    this.touched()
  }
}

@NgModule({
  declarations: [CustomLookupFormComponent, LookupFormDialogComponent],
  imports: [
    CustomDialogModule,
    NgIf,
    NgClass,
    InputWrapperModule,
    InputTextModule,
    CustomButtonModule
  ],
  exports: [CustomLookupFormComponent],
  entryComponents: [LookupFormDialogComponent]
})

export class CustomLookupFormModule {

}
