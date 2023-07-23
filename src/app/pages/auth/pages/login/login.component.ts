import {Component, OnInit} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginReqDto} from "../../../../models/DTOs/login-req.dto";
import {GRANT_TYPES} from "../../../../constants/enums";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    .captcha-container {
      border: 1px solid #ced4da;
      border-radius: 3px;
      height: 42px;
      padding: 0.5rem;

      input {
        border: none;
        height: 100%;
        outline: unset
      }

      .captcha-image {
        border-right: 1px solid #ced4da;
        border-left: 1px solid #ced4da;
        height: inherit
      }

      i {
        font-size: 1.5rem;
        color: #2196F3;;
      }
    }
  `]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  captchaId: string

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      captchaAnswer: this.fb.control(null, [Validators.required]),
    })
    await this.handleFetchCaptcha()
  }

  async handLogin() {
    try {
      const payload = new LoginReqDto(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['captchaAnswer'].value,
        this.captchaId,
        GRANT_TYPES.passwordCaptcha
      )
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

  async handleFetchCaptcha(): Promise<void> {
    try {
      await this.oauthFacade.loadCaptcha()
    } catch (e) {
      console.log(e)
    }
  }
}
