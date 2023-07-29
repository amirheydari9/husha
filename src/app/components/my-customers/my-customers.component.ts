import {Component, NgModule, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {HushaDropdownModule} from "../../ui-kits/husha-dropdown/husha-dropdown.component";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  mCustomersForm: FormGroup
  subscription: Subscription[] = []

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.mCustomersForm = this.fb.group({
      parentCustomers: this.fb.control(null, [Validators.required]),
      childCustomers: this.fb.control(null, [Validators.required]),
      services: this.fb.control(null, [Validators.required]),
      units: this.fb.control(null, [Validators.required]),
    })
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
    HushaDropdownModule
  ],
  exports: [
    MyCustomersComponent
  ]
})
export class MyCustomersNodule {

}
