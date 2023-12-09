import {Component, Input, NgModule, OnInit, Self} from '@angular/core';
import {BaseControlValueAccessor} from "../../utils/BaseControlValueAccessor";
import {FormControl, FormsModule, NgControl} from "@angular/forms";
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {LookupFormDialogComponent} from "./lookup-form-dialog.component";
import {NgClass, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {CustomButtonModule} from "../custom-button/custom-button.component";
import {BaseInfoService} from "../../api/base-info.service";
import {FetchFormDataByIdDTO} from "../../models/DTOs/fetch-form-data-by-id.DTO";
import {FORM_KIND} from "../../constants/enums";
import {ActivatedRoute} from "@angular/router";
import {HushaFormUtilService} from "../../utils/husha-form-util.service";
import {HushaCustomerUtilService} from "../../utils/husha-customer-util.service";
import {DialogManagementService} from "../../utils/dialog-management.service";
import {DynamicDialogActionsModule} from "../../components/dynamic-dilaog-actions/dynamic-dialog-actions.component";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {FieldErrorModule} from "../field-error/field-error.component";

@AutoUnsubscribe()
@Component({
  selector: 'app-custom-lookup-form',
  template: `
    <div class="flex align-items-stretch">
      <app-custom-button
        type="button"
        [icon]="'pi pi-table'"
        (onClick)="handleOpenDialog()"
      ></app-custom-button>
      <div class="flex-grow-1 uikit-wrapper-height">
          <span class="p-input-icon-left p-float-label w-full">
             <i class="pi pi-times cursor-pointer" *ngIf="control.value" (click)="handleReset()"></i>
             <input
               type="text"
               readonly
               #input
               pInputText
               [(ngModel)]="value"
               [disabled]="disabled"
               [ngClass]="{'ng-invalid ng-dirty' : control.invalid &&( control.dirty || control.touched)}"
               [style]="{'width':'100%','border-right':'0','border-top-right-radius':'0','border-bottom-right-radius':'0'}"
               (blur)="touched()">
            <label class="text-1 font-sm-regular">{{field.caption}}</label>
          </span>
        <app-field-error *ngIf="control.invalid" [formField]="control"></app-field-error>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 44px;
      }
    }
  `],
})
export class CustomLookupFormComponent extends BaseControlValueAccessor<any> implements OnInit {

  control: FormControl

  @Input() public field: IFormField
  @Input() public form: IFetchFormRes

  constructor(
    @Self() public controlDir: NgControl,
    private activatedRoute: ActivatedRoute,
    private hushaFormUtilService: HushaFormUtilService,
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private dialogManagementService: DialogManagementService
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

  handleOpenDialog() {
    this.dialogManagementService.openDialog(LookupFormDialogComponent, {
      data: {field: this.field},
    }).subscribe(data => {
      if (data) {
        this.changed(data.id)
        this.writeValue(`${data.code} - ${data.title}`)
      }
      this.touched()
    })
  }

  handleReset() {
    this.changed(null)
    this.writeValue(null)
  }
}

@NgModule({
  declarations: [CustomLookupFormComponent, LookupFormDialogComponent],
  imports: [
    NgClass,
    NgIf,
    InputTextModule,
    CustomButtonModule,
    FormsModule,
    DynamicDialogActionsModule,
    FieldErrorModule
  ],
  exports: [CustomLookupFormComponent],
  entryComponents: [LookupFormDialogComponent]
})

export class CustomLookupFormModule {

}
