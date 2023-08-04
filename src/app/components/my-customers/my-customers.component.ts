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
import {GetServicesReqDTO} from "../../models/DTOs/get-services-req.DTO";
import {GetPeriodReqDTO} from "../../models/DTOs/get-period-req.DTO";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";
import {IGetUnitsRes} from "../../models/interface/get-units-res.interface";
import {IGetPeriodRes} from "../../models/interface/get-period-res.interface";
import {GetUnitsReqDTO} from "../../models/DTOs/get-units-req.DTO";
import {FetchMenuReqDTO} from "../../models/DTOs/fetch-menu-req.DTO";
import {MenuItem} from "primeng/api";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  myCustomersForm: FormGroup
  subscription: Subscription[] = []
  totalChildCustomers: IMyCustomerRes[] = []
  parentCustomers: IMyCustomerRes[] = []
  childCustomers: IMyCustomerRes[] = []
  customerServices: IGetServicesRes[] = []
  customerUnits: IGetUnitsRes[] = []
  customerPeriods: IGetPeriodRes[] = []
  showUnitsCtrl: boolean = false
  items: MenuItem[] = []

  constructor(
    private fb: FormBuilder,
    private customerFacade: CustomerFacade,
    private baseInfoFacade: BaseInfoFacade,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.myCustomersForm = this.fb.group({
      parentCustomers: this.fb.control(null, [Validators.required]),
      childCustomers: this.fb.control(null, [Validators.required]),
      services: this.fb.control(null, [Validators.required]),
      units: this.fb.control(null),
      periods: this.fb.control(null, [Validators.required]),
    })
    await this.baseInfoFacade.fetchMenu()
    await this.customerFacade.fetchMyCustomers()
    this.subscription.push(
      this.customerFacade.myCustomers$.subscribe(data => {
        data.forEach(item => {
          item.parentId ? this.totalChildCustomers.push(item) : this.parentCustomers.push(item)
        })
        this.parentCustomersCtrl.setValue(this.parentCustomers)
        // const x = []
        // const y = []
        // const t = []
        // data.forEach(item => item.parentId === null ? x.push(item) : y.push(item))
        // x.forEach(item => {
        //   let q = []
        //   y.forEach(value => {
        //     if (item.id === value.parentId) q.push(value)
        //   })
        //   item = {...item, items: q}
        //   t.push(item)
        //   q = []
        // })
        // this.items = t.map(item => this.transformMenu(item))
      })
    )

    this.subscription.push(
      this.parentCustomersCtrl.valueChanges.subscribe(async data => {
        this.customerServices = []
        this.customerUnits = []
        this.customerPeriods = []
        const hasChild = this.totalChildCustomers.find(item => item.parentId === data)
        if (hasChild) {
          this.childCustomers = this.totalChildCustomers.filter(item => item.parentId === data)
        } else {
          await this.handleFetchServicesAndPeriods(data)
        }
      })
    )

    this.subscription.push(
      this.childCustomersCtrl.valueChanges.subscribe(async data => {
        this.servicesCtrl.setValue(null)
        this.periodsCtrl.setValue(null)
        await this.handleFetchServicesAndPeriods(data)
      })
    )

    this.subscription.push(
      this.servicesCtrl.valueChanges.subscribe(async data => {
        this.showUnitsCtrl = false
        this.customerUnits = []
        this.unitsCtrl.setValue(null)
        this.unitsCtrl.removeValidators([Validators.required])
        const service = this.customerServices.find(item => item.id === data)
        if (service && service.haveUnit) {
          this.unitsCtrl.setValidators([Validators.required])
          await this.customerFacade.getCustomerUnits(new GetUnitsReqDTO(115, data))
          this.subscription.push(
            this.customerFacade.customerUnits$.subscribe(data => this.customerUnits = data)
          )
          this.showUnitsCtrl = true
        }
        this.unitsCtrl.updateValueAndValidity()
        this.handleFetchMenu()
      })
    )

    this.subscription.push(
      this.unitsCtrl.valueChanges.subscribe(async data => {
        if (data) this.handleFetchMenu()
      })
    )

    this.subscription.push(
      this.periodsCtrl.valueChanges.subscribe(data => this.handleFetchMenu())
    )
  }

  handleFetchMenu() {
    setTimeout(async () => {
      if (this.myCustomersForm.valid) {
        const payload = new FetchMenuReqDTO(
          115,
          this.servicesCtrl.value,
          this.unitsCtrl.value,
          this.periodsCtrl.value,
        )
        await this.baseInfoFacade.fetchMenu(payload)
      }
    })
  }

  async handleFetchServicesAndPeriods(customerId: number) {
    await Promise.all([
      this.customerFacade.getCustomerServices(new GetServicesReqDTO(customerId)),
      this.customerFacade.getCustomerPeriods(new GetPeriodReqDTO(customerId))
    ])
    this.subscription.push(
      this.customerFacade.customerServices$.subscribe(data => this.customerServices = data)
    )
    this.subscription.push(
      this.customerFacade.customerPeriods$.subscribe(data => this.customerPeriods = data)
    )
  }


  get parentCustomersCtrl(): FormControl {
    return this.myCustomersForm.controls['parentCustomers'] as FormControl
  }

  get childCustomersCtrl(): FormControl {
    return this.myCustomersForm.controls['childCustomers'] as FormControl
  }

  get servicesCtrl(): FormControl {
    return this.myCustomersForm.controls['services'] as FormControl
  }

  get unitsCtrl(): FormControl {
    return this.myCustomersForm.controls['units'] as FormControl
  }

  get periodsCtrl(): FormControl {
    return this.myCustomersForm.controls['periods'] as FormControl
  }

  // transformMenu(menu) {
  //     const {title, items, id, name, ...rest} = menu;
  //     return {
  //       id: id,
  //       label: title,
  //       items: items && items.length > 0 ? items.map(this.transformMenu.bind(this)) :null,
  //     };
  //   }
  //
}

@NgModule({
  declarations: [MyCustomersComponent],
  imports: [
    ReactiveFormsModule,
    HushaDropdownModule,
    CustomerStore,
    CommonModule,
  ],
  exports: [
    MyCustomersComponent
  ]
})
export class MyCustomersNodule {

}
