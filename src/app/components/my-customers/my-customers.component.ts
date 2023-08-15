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
import {StorageService} from "../../utils/storage.service";
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../../constants/keys";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  subscription: Subscription[] = []

  services: IGetServicesRes[] = []

  customerMenuItems: MenuItem[] = []
  serviceMenuItems: MenuItem[] = []
  unitMenuItems: MenuItem[] = []
  periodMenuItems: MenuItem[] = []

  selectedCustomer: MenuItem;
  selectedService: IGetServicesRes;
  selectedUnit: MenuItem;
  selectedPeriod: MenuItem;

  showUnitMenu: boolean = false

  @ViewChild(HushaMenuComponent) customerMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) serviceMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) unitMenu: HushaMenuComponent
  @ViewChild(HushaMenuComponent) periodMenu: HushaMenuComponent

  constructor(
    private customerFacade: CustomerFacade,
    private baseInfoFacade: BaseInfoFacade,
    private storageService: StorageService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.selectedCustomer = this.storageService.getSessionStorage(selectedCustomerKey);
    this.selectedService = this.storageService.getSessionStorage(selectedServiceKey);
    this.selectedUnit = this.storageService.getSessionStorage(selectedUnitKey);
    this.selectedPeriod = this.storageService.getSessionStorage(selectedPeriodKey);
    try {
      const payload = new FetchMenuReqDTO(
        +this.selectedCustomer?.id,
        +this.selectedService?.id,
        +this.selectedUnit?.id,
        +this.selectedPeriod?.id,
      )
      await this.baseInfoFacade.fetchMenu(payload)
    } catch (e) {
      console.log(e)
    }
    try {
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
          this.customerMenuItems = t.map(item => this.createMenu(item))
        })
      )
    } catch (e) {
      console.log(e)
    }
    if (this.selectedCustomer) {
      await this.handleFetchServicesAndPeriods(+this.selectedCustomer.id)
    }
    if (this.selectedUnit) {
      await this.handleFetchUnits()
    }
  }

  createMenu(menu) {
    const {title, items, id} = menu;
    return {
      id: id,
      label: title,
      items: items && items.length > 0 ? items.map(this.createMenu.bind(this)) : null,
    };
  }

  async handleSelectCustomer($event: MenuItem) {
    this.selectedCustomer = $event
    this.storageService.setSessionStorage(selectedCustomerKey, $event)
    this.resetService()
    this.resetUnit()
    this.resetPeriod()
    await this.handleFetchServicesAndPeriods(+$event.id)
  }

  async handleFetchServicesAndPeriods(customerId: number) {
    try {
      await Promise.allSettled([
        this.customerFacade.getCustomerServices(new GetServicesReqDTO(customerId)),
        this.customerFacade.getCustomerPeriods(new GetPeriodReqDTO(customerId))
      ])
      this.subscription.push(
        this.customerFacade.customerServices$.subscribe(data => {
          this.services = data
          this.serviceMenuItems = data.map(item => this.createMenu(item))
        })
      )
      this.subscription.push(
        this.customerFacade.customerPeriods$.subscribe(data => this.periodMenuItems = data.map(item => this.createMenu(item)))
      )
    } catch (e) {
      console.log(e)
    }
  }

  async handleSelectService($event: MenuItem) {
    const service = this.services.find(item => item.id === +$event.id)
    this.selectedService = service
    this.resetUnit()
    this.storageService.setSessionStorage(selectedServiceKey, service)
    service.haveUnit ? await this.handleFetchUnits() : await this.handleFetchMenu()
  }

  async handleFetchUnits() {
    this.showUnitMenu = true
    await this.customerFacade.getCustomerUnits(new GetUnitsReqDTO(+this.selectedCustomer.id, +this.selectedService.id))
    this.subscription.push(
      this.customerFacade.customerUnits$.subscribe(data => this.unitMenuItems = data.map(item => this.createMenu(item)))
    )
  }

  async handleSelectUnit($event: MenuItem) {
    this.selectedUnit = $event
    this.storageService.setSessionStorage(selectedUnitKey, $event)
    await this.handleFetchMenu()
  }

  async handleSelectPeriod($event: MenuItem) {
    this.selectedPeriod = $event
    this.storageService.setSessionStorage(selectedPeriodKey, $event)
    await this.handleFetchMenu()
  }

  resetService() {
    this.selectedService = null
    this.serviceMenuItems = []
    this.storageService.removeSessionStorage(selectedServiceKey)
  }

  resetUnit() {
    this.showUnitMenu = false
    this.selectedUnit = null
    this.unitMenuItems = []
    this.storageService.removeSessionStorage(selectedUnitKey)
  }

  resetPeriod() {
    this.selectedPeriod = null
    this.periodMenuItems = []
    this.storageService.removeSessionStorage(selectedPeriodKey)
  }

  async handleFetchMenu(): Promise<void> {
    if (this.selectedService && this.selectedPeriod) {
      if (this.showUnitMenu && this.selectedUnit) {
        const payload = new FetchMenuReqDTO(
          +this.selectedCustomer.id,
          +this.selectedService.id,
          +this.selectedUnit.id,
          +this.selectedPeriod.id,
        )
        await this.baseInfoFacade.fetchMenu(payload)
      }
      if (!this.showUnitMenu) {
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
