import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() collapsed: boolean = false
  @Input() screenWidth: number = 0

  constructor() {
  }

  ngOnInit(): void {
  }

  getHeaderClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed'
    } else {
      styleClass = 'head-md-screen'
    }
    return styleClass;
  }
}
