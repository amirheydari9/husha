import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-husha-button',
  template: `
    <div [class]="class">
      <p-button
        [type]="type"
        [label]="label"
        [styleClass]="styleClass"
        [loading]="loading"
        [disabled]="disabled"
        [icon]="icon"
        iconPos="left"
        [style]="{'width':'100%'}"
        (onClick)="handleClick($event)"
      ></p-button>
    </div>
  `
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

