import {Component, NgModule, OnInit} from '@angular/core';
import {OauthFacade} from "../../data-core/oauth/oauth.facade";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/Custom-Validators";
import {CommonModule} from "@angular/common";
import {HushaFieldErrorModule} from "../../ui-kits/husha-field-error/husha-field-error.component";

@Component({
  selector: 'app-captcha',
  template: `
    <div class="d-flex flex-column mb-4">
      <div class="d-flex align-items-center justify-content-between captcha-container"
           [ngClass]="{'error-border':control.invalid && (control.dirty || control.touched)}">
        <input [formControl]="control" class="col-2 text-center"/>
        <div class="d-flex align-items-center justify-content-center flex-grow-1 captcha-image">
          <img [src]="" alt="captcha"/>
        </div>
        <div class="d-flex align-items-center justify-content-center">
          <i class="pi pi-refresh text-center" (click)="handleFetchCaptcha()"></i>
        </div>
      </div>
      <app-husha-field-error [formField]="control"></app-husha-field-error>
    </div>`,
  styles: [`
    .captcha-container {
      border: 1px solid #ced4da;
      border-radius: 3px;
      height: 42px;
      padding: 0.5rem;
      z-index: 2;

      &.error-border {
        border: 1px solid #f44336;
      }

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
export class CaptchaComponent implements OnInit {

  control: FormControl

  constructor(
    private oauthFacade: OauthFacade,
    private fb: FormBuilder
  ) {
  }

  createCaptcha() {
    this.control = this.fb.control(null, [Validators.required, CustomValidators.noWhitespace])
    return this.control
  }

  async ngOnInit(): Promise<void> {
    await this.handleFetchCaptcha()
  }

  async handleFetchCaptcha(): Promise<void> {
    try {
      await this.oauthFacade.loadCaptcha()
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
