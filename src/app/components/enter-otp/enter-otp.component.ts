import {Component, NgModule, OnInit} from '@angular/core';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss']
})
export class EnterOtpComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [EnterOtpComponent],
  exports: [EnterOtpComponent]
})
export class EnterOtpModule {

}
