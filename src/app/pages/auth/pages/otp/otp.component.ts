import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NgOtpInputComponent, NgOtpInputConfig} from "ng-otp-input";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {CountdownComponent, CountdownConfig, CountdownEvent} from "ngx-countdown";
import {Router} from "@angular/router";

@AutoUnsubscribe()
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  @ViewChild(NgOtpInputComponent) ngOtpInput: NgOtpInputComponent;
  @ViewChild(CountdownComponent) countdown: CountdownComponent;

  otpControl: FormControl
  otpConfig: NgOtpInputConfig = {
    length: 5,
    allowNumbersOnly: true,
    containerClass: 'text-center',
    inputClass: 'otp-invalid'
  }
  countDownConfig: CountdownConfig = {
    leftTime: 2,
    format: 'mm:ss'
  };
  showRetry: boolean = false
  subscription: Subscription

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.otpControl = this.fb.control(null, [Validators.required, Validators.minLength(this.otpConfig.length)])
    this.subscription = this.otpControl.valueChanges.subscribe(() => {
      this.otpControl.valid
        ? this.ngOtpInput.config.inputClass = 'otp-valid'
        : this.ngOtpInput.config.inputClass = 'otp-invalid'
    })
    this.countdown?.begin();
  }

  handleResendOtp() {
    this.showRetry = false
    this.ngOtpInput.setValue(null)
    this.countdown?.restart();
  }

  handleCountDownEvent($event: CountdownEvent) {
    if ($event.status === 3) {
      this.showRetry = true
    }
  }

  handleSubmitOtp() {
    this.router.navigate(['/auth/forget-password'])
  }
}
