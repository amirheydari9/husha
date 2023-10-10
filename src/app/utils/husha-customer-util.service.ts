import {Injectable} from '@angular/core';
import {selectedCustomerKey, selectedPeriodKey, selectedServiceKey, selectedUnitKey} from "../constants/keys";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class HushaCustomerUtilService {

  constructor(
    private storageService: StorageService,
  ) {
  }

  get customer() {
    return this.storageService.getSessionStorage(selectedCustomerKey)
  }

  set customer(data) {
    this.storageService.setSessionStorage(selectedCustomerKey, data)
  }

  get service() {
    return this.storageService.getSessionStorage(selectedServiceKey)
  }

  set service(data) {
    if (!data) {
      this.storageService.removeSessionStorage(selectedServiceKey)
    } else {
      this.storageService.setSessionStorage(selectedServiceKey, data)
    }
  }

  get serviceTypeId() {
    // TODO return this.service?.serviceType.id
    return 24
  }

  get unit() {
    return this.storageService.getSessionStorage(selectedUnitKey)
  }

  set unit(data) {
    if (!data) {
      this.storageService.removeSessionStorage(selectedUnitKey)
    } else {
      this.storageService.setSessionStorage(selectedUnitKey, data)
    }
  }

  get period() {
    return this.storageService.getSessionStorage(selectedPeriodKey)
  }

  set period(data) {
    if (!data) {
      this.storageService.removeSessionStorage(selectedPeriodKey)
    } else {
      this.storageService.setSessionStorage(selectedPeriodKey, data)
    }
  }
}
