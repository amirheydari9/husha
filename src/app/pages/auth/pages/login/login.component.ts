import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../../data-store/auth-store/auth.facade";
import {OtpType} from "../../../../config/enums";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {GetOtpReqDTO} from "../../../../models/dtos/get-otp-req.DTO";
import {LoginByPasswordReqDTO} from "../../../../models/dtos/login-by-password-req.DTO";

@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  LoginForm: FormGroup
  nationalCode: string
  subscription: Subscription

  get OtpType(): typeof OtpType {
    return OtpType
  }

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
  ) {
  }

  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
    this.subscription = this.authFacade.nationalCode$.subscribe(data => this.nationalCode = data)
  }

  async handleLogin() {
    try {
      await this.authFacade.loginByPassword(new LoginByPasswordReqDTO(this.nationalCode, this.LoginForm.controls['password'].value))
    } catch (e) {
      console.log(e)
    }
  }

  async handleGetOtp(otpType: OtpType) {
    const payload = new GetOtpReqDTO(this.nationalCode, otpType)
    await this.authFacade.getOtp(payload)
  }

}
