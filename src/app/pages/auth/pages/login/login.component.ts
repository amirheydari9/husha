import {Component, OnInit} from '@angular/core';
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
