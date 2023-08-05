import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {CustomerFacade} from "../../data-core/customer/customer.facade";
import {CustomerStore} from "../../data-core/customer/customer.store";
import {CommonModule} from "@angular/common";
import {BaseInfoFacade} from "../../data-core/base-info/base-info.facade";
import {GetServicesReqDTO} from "../../models/DTOs/get-services-req.DTO";
import {GetPeriodReqDTO} from "../../models/DTOs/get-period-req.DTO";
import {MenuItem} from "primeng/api";
import {HushaMenuComponent, HushaMenuModule} from "../../ui-kits/husha-menu/husha-menu.component";
import {FetchMenuReqDTO} from "../../models/DTOs/fetch-menu-req.DTO";
import {GetUnitsReqDTO} from "../../models/DTOs/get-units-req.DTO";
import {IGetServicesRes} from "../../models/interface/get-services-res.interface";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  subscription: Subscription[] = []

  customers: MenuItem[] = []
  customerServices: MenuItem[] = []
  customerUnits: MenuItem[] = []
  customerPeriods: MenuItem[] = []

  originalCustomerServices: IGetServicesRes[] = []
  showUnit: boolean = false


  selectedCustomer: MenuItem;
  selectedService: MenuItem;
  selectedUnit: MenuItem;
  selectedPeriod: MenuItem;

  @ViewChild(HushaMenuComponent) customerMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) serviceMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) unitMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) periodMenu: HushaMenuComponent

  constructor(
    private customerFacade: CustomerFacade,
    private baseInfoFacade: BaseInfoFacade,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.baseInfoFacade.fetchMenu()
    await this.customerFacade.fetchMyCustomers()
    this.subscription.push(
      this.customerFacade.myCustomers$.subscribe(data => {
        const x = []
        const y = []
        const t = []
        data.forEach(item => item.parentId === null ? x.push(item) : y.push(item))
        x.forEach(item => {
          let q = []
          y.forEach(value => {
            if (item.id === value.parentId) q.push(value)
          })
          item = {...item, items: q}
          t.push(item)
          q = []
        })
        this.customers = t.map(item => this.transformMenu(item))
      })
    )
  }

  async handleFetchServicesAndPeriods(customerId: number) {
    this.selectedService = null
    this.selectedUnit = null
    this.selectedPeriod = null
    try {
      await Promise.allSettled([
        this.customerFacade.getCustomerServices(new GetServicesReqDTO(customerId)),
        this.customerFacade.getCustomerPeriods(new GetPeriodReqDTO(customerId))
      ])
      this.subscription.push(
        this.customerFacade.customerServices$.subscribe(data => {
          this.originalCustomerServices = data
          this.customerServices = data.map(item => this.transformMenu(item))
        })
      )
      this.subscription.push(
        this.customerFacade.customerPeriods$.subscribe(data => this.customerPeriods = data.map(item => this.transformMenu(item)))
      )
    } catch (e) {
      console.log(e)
    }
  }

  transformMenu(menu) {
    const {title, items, id, name, ...rest} = menu;
    return {
      id: id,
      label: title,
      items: items && items.length > 0 ? items.map(this.transformMenu.bind(this)) : null,
    };
  }

  async handleFetchMenu(): Promise<boolean | void> {
    if (this.customerServices && this.customerServices && this.selectedPeriod) {
      if (this.showUnit && this.selectedUnit) {
        const payload = new FetchMenuReqDTO(
          +this.selectedCustomer.id,
          +this.selectedService.id,
          +this.selectedUnit.id,
          +this.selectedPeriod.id,
        )
        await this.baseInfoFacade.fetchMenu(payload)
      }
      if (!this.showUnit) {
        const payload = new FetchMenuReqDTO(
          +this.selectedCustomer.id,
          +this.selectedService.id,
         null,
          +this.selectedPeriod.id,
        )
        await this.baseInfoFacade.fetchMenu(payload)
      }
    }
  }

  async handleSelectCustomer($event: MenuItem) {
    this.selectedCustomer = $event
    await this.handleFetchServicesAndPeriods(+$event.id)
  }

  async handleSelectService($event: MenuItem) {
    this.selectedService = $event
    this.showUnit = false
    this.selectedUnit = null
    this.customerUnits = []
    const service = this.originalCustomerServices.find(item => item.id === +$event.id)
    if (service.haveUnit) {
      this.showUnit = true
      await this.customerFacade.getCustomerUnits(new GetUnitsReqDTO(+this.selectedCustomer.id, +$event.id))
      this.subscription.push(
        this.customerFacade.customerUnits$.subscribe(data => this.customerUnits = data.map(item => this.transformMenu(item)))
      )
    } else {
      await this.handleFetchMenu()
    }

  }

  async handleSelectUnit($event: MenuItem) {
    this.selectedUnit = $event
    await this.handleFetchMenu()
  }

  async handleSelectPeriod($event: MenuItem) {
    this.selectedPeriod = $event
    await this.handleFetchMenu()
  }
}

@NgModule({
  declarations: [MyCustomersComponent],
  imports: [
    CustomerStore,
    CommonModule,
    HushaMenuModule,
  ],
  exports: [
    MyCustomersComponent
  ]
})
export class MyCustomersNodule {

}
