import {Component, NgModule, OnInit} from '@angular/core';
import {OauthFacade} from "../../data-core/oauth/oauth.facade";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {ICaptchaRes} from "../../models/interface/captcha-res.interface";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Base64PipeModule} from "../../pipes/base64.pipe";
import {FieldErrorModule} from "../../ui-kits/field-error/field-error.component";

@AutoUnsubscribe()
@Component({
  selector: 'app-captcha',
  template: `
    <div class="flex flex-column captcha-container">
      <div class="flex align-items-center justify-content-between captcha"
           [ngClass]="{'error-border':control.invalid && (control.dirty || control.touched)}">
        <input [formControl]="control" type="number" class="col-2 text-center"/>
        <div class="flex align-items-center justify-content-center flex-grow-1 captcha-image">
          <img *ngIf="captcha" [src]="captcha.data|base64" height="30" alt="captcha"
               class="text-center"/>
        </div>
        <div class="flex align-items-center justify-content-center px-2">
          <i class="pi pi-refresh" (click)="handleFetchCaptcha()"></i>
        </div>
      </div>
      <app-field-error [formField]="control"></app-field-error>
    </div>`,
  styles: [`
    @import "../../../scss/variabels";

    .captcha-container {
      height: 75px;

      .captcha {
        border: 1px solid $color-2;
        border-radius: 6px;
        height: 42px;
        z-index: 2;

        &.error-border {
          border: 1px solid $forbidden;
        }

        input {
          border: none;
          //height: 100%;
          outline: unset;
          border-radius: 6px;
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
    Base64PipeModule,
    FieldErrorModule
  ],
  exports: [CaptchaComponent]
})
export class CaptchaModule {

}
