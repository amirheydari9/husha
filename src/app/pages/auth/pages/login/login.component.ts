import {Component, OnInit} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
    }
  `]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

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
    try {
      await this.oauthFacade.loadCaptcha()
    } catch (e) {
      console.log(e)
    }
  }

  async handLogin() {
    try {
      const payload = this.loginForm.value
      console.log(payload)
      await this.oauthFacade.login(payload)
    } catch (e) {
      console.log(e)
    }
  }

}
