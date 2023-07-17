import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-husha-button',
  templateUrl: './husha-button.component.html',
  styleUrls: ['./husha-button.component.scss']
})
export class HushaButtonComponent {

  @Input() type = 'submit';

  @Input() label: string;

  @Input() class: string;

  @Input() styleClass: string;

  @Input() loading: boolean;

  @Input() disabled: boolean;

  @Input() icon: string;

  @Output()
  onclick: EventEmitter<any> = new EventEmitter<any>();

  handleClick($event: any): void {
    this.onclick.emit($event);
  }

}

@NgModule({
  declarations: [HushaButtonComponent],
  imports: [CommonModule, ButtonModule, ButtonModule],
  exports: [HushaButtonComponent]
})
export class HushaButtonModule {

}

