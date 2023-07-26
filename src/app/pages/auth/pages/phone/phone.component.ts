import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CaptchaComponent} from "../../../../components/captcha/captcha.component";
import {CustomValidators} from "../../../../utils/Custom-Validators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {

  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent
  phoneForm: FormGroup


  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.phoneForm = this.fb.group({
      mobileNumber: this.fb.control(null, [Validators.required, CustomValidators.mobile]),
      captchaAnswer: this.captchaComponent.createCaptcha()
    })
  }

  handleSubmit() {
    this.router.navigate(['/auth/otp'])
  }
}
