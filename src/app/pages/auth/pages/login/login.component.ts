import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {GRANT_TYPES} from "../../../../constants/enums";
import {CaptchaComponent} from "../../../../components/captcha/captcha.component";
import {Subscription} from "rxjs";
import {ICaptchaRes} from "../../../../models/interface/captcha-res.interface";
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent

  subscription: Subscription
  loginForm: FormGroup
  captcha: ICaptchaRes

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.fb.group({
      username: this.fb.control('amirhoseni', [Validators.required]),
      password: this.fb.control('Q12345678q!', [Validators.required]),
      captchaAnswer: this.captchaComponent.createCaptcha()
    })
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captchaComponent.captcha.id,
        GRANT_TYPES.PASSWORD
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

}
