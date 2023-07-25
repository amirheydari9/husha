import {Component, NgModule, OnInit} from '@angular/core';
import {OauthFacade} from "../../data-core/oauth/oauth.facade";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {HushaFieldErrorModule} from "../../ui-kits/husha-field-error/husha-field-error.component";
import {ICaptchaRes} from "../../models/interface/captcha-res.interface";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-captcha',
  template: `
    <div class="d-flex flex-column captcha-container">
      <div class="d-flex align-items-center justify-content-between captcha"
           [ngClass]="{'error-border':control.invalid && (control.dirty || control.touched)}">
        <input [formControl]="control" type="number" class="col-2 text-center"/>
        <div class="d-flex align-items-center justify-content-center flex-grow-1 captcha-image">
          <img *ngIf="captcha" [src]="'data:image/png;base64,'+captcha.data" height="30" alt="captcha"
               class="text-center"/>
        </div>
        <div class="d-flex align-items-center justify-content-center px-2">
          <i class="pi pi-refresh" (click)="handleFetchCaptcha()"></i>
        </div>
      </div>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>`,
  styles: [`
    @import "../../../scss/variabels";

    .captcha-container {
      height:70px;

      .captcha {
        border: 1px solid $color-2;
        border-radius: 3px;
        height: 42px;
        z-index: 2;

        &.error-border {
          border: 1px solid $forbidden;
        }

        input {
          border: none;
          height: 100%;
          outline: unset
        }

        .captcha-image {
          border-right: 1px solid $color-2;
          border-left: 1px solid $color-2;
          height: inherit
        }

        i {
          font-size: 1.5rem;
          color: $primary;
        }
      }
    }
  `]
})
export class CaptchaComponent implements OnInit {

  control: FormControl
  captcha: ICaptchaRes
  subscription: Subscription

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder,
  ) {
  }

  createCaptcha() {
    this.control = this.fb.control(null, [Validators.required])
    return this.control
  }

  async ngOnInit(): Promise<void> {
    await this.handleFetchCaptcha()
  }

  async handleFetchCaptcha(): Promise<void> {
    try {
      await this.oauthFacade.loadCaptcha()
      this.subscription = this.oauthFacade.captcha$.subscribe(data => this.captcha = data)
    } catch (e) {
      console.log(e)
    }
  }
}

@NgModule({
  declarations: [CaptchaComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HushaFieldErrorModule
  ],
  exports: [CaptchaComponent]
})
export class CaptchaModule {

}
