import {Component, OnInit} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {grantType} from "../../../../constants/enums";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  captchaId: string

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      captchaAnswer: this.fb.control(null, [Validators.required]),
    })
    try {
      await this.oauthFacade.loadCaptcha()
    } catch (e) {
      console.log(e)
    }
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captchaId,
        grantType.passwordCaptcha
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

}
