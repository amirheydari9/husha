import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";
import {CustomDialogModule} from "../custom-dialog/custom-dialog.component";
import {NgClass, NgIf} from "@angular/common";
import {InputWrapperModule} from "../input-wrapper/input-wrapper.component";
import {InputTextModule} from "primeng/inputtext";
import {CustomButtonModule} from "../custom-button/custom-button.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDataByIdDTO} from "../../models/DTOs/fetch-form-data-by-id.DTO";
import {FORM_KIND} from "../../constants/enums";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../utils/husha-form-util.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";

@Component({
  selector: 'app-custom-lookup-form',
  template: `
    <div class="flex align-items-stretch">
      <app-custom-button
        type="button"
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
            [(ngModel)]="value"
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
  @Input() public form: IFetchFormRes

  constructor(
    @Self() public controlDir: NgControl,
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService,
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
    super()
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    this.control = this.controlDir.control as FormControl
    if (this.value) {
      this.baseInfoService.fetchFormData(this.handleCreatePayloadForFetchFormData()).subscribe(data => {
        this.writeValue(`${data.code} - ${data.title}`)
      })
    }
  }

  handleCreatePayloadForFetchFormData() {
    return new FetchFormDataByIdDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.serviceTypeId,
      this.form.id,
      this.form.formKind.id,
      +this.value,
      this.form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
      this.form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
      this.form.formKind.id === FORM_KIND.DETAIL ? this.activatedRoute.snapshot.queryParams['masterId'] : null,
    )
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
    CustomButtonModule,
    FormsModule
  ],
  exports: [CustomLookupFormComponent],
  entryComponents: [LookupFormDialogComponent]
})

export class CustomLookupFormModule {

}
