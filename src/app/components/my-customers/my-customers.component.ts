import {Component, NgModule, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {HushaDropdownModule} from "../../ui-kits/husha-dropdown/husha-dropdown.component";
import {CustomerFacade} from "../../data-core/customer/customer.facade";
import {CustomerStore} from "../../data-core/customer/customer.store";
import {IMyCustomerRes} from "../../models/interface/my-customer-res.interface";
import {CommonModule} from "@angular/common";
import {BaseInfoFacade} from "../../data-core/base-info/base-info.facade";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  mCustomersForm: FormGroup
  subscription: Subscription[] = []
  totalChildCustomers: IMyCustomerRes[] = []
  parentCustomers: IMyCustomerRes[] = []
  childCustomers: IMyCustomerRes[] = []

  constructor(
    private fb: FormBuilder,
    private customerFacade: CustomerFacade,
    private baseInfoFacade: BaseInfoFacade,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.mCustomersForm = this.fb.group({
      parentCustomers: this.fb.control(null, [Validators.required]),
      childCustomers: this.fb.control(null, [Validators.required]),
      services: this.fb.control(null, [Validators.required]),
      units: this.fb.control(null, [Validators.required]),
    })
    await this.customerFacade.fetchMyCustomers()
    this.subscription.push(
      this.customerFacade.myCustomers$.subscribe(data => {
        data.forEach(item => {
          item.parentId ? this.totalChildCustomers.push(item) : this.parentCustomers.push(item)
        })
        this.parentCustomersCtrl.setValue(this.parentCustomers)
      })
    )
    this.subscription.push(
      this.parentCustomersCtrl.valueChanges.subscribe(async data => {
        await this.baseInfoFacade.fetchMenu()
        this.childCustomers = this.totalChildCustomers.filter(item => item.parentId === data)
        this.childCustomersCtrl.setValue(this.childCustomers)
      })
    )
  }

  get parentCustomersCtrl(): FormControl {
    return this.mCustomersForm.controls['parentCustomers'] as FormControl
  }

  get childCustomersCtrl(): FormControl {
    return this.mCustomersForm.controls['childCustomers'] as FormControl
  }

}

@NgModule({
  declarations: [MyCustomersComponent],
  imports: [
    ReactiveFormsModule,
    HushaDropdownModule,
    CustomerStore,
    CommonModule
  ],
  exports: [
    MyCustomersComponent
  ]
})
export class MyCustomersNodule {

}
