import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../../utils/Custom-Validators";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPassword: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.forgetPassword = this.fb.group({
      password: this.fb.control(null, Validators.required),
      confirmPassword: this.fb.control(null, Validators.required),
    }, {
      validators: CustomValidators.passwordMatch
    })
  }

  handleForgetPassword() {

  }
}
