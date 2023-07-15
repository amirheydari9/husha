import {Component, EventEmitter, HostListener, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {navBaData} from "../nav-data";
import {INavbarData} from "../navbar-data.interface";
import {fadeInOut} from "../animations";
import {Router} from "@angular/router";

export interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({transform: 'rotate(0deg)', offset: '0'}),
          style({transform: 'rotate(2turn)', offset: '1'}),
        ]))
      ])
    ]),
  ]
})
export class SidenavComponent implements OnInit {

  collapsed: boolean = false;
  screenWidth = 0;
  navData = navBaData
  multiple: boolean = false

  @Output() onToggleSidenav: EventEmitter<SidenavToggle> = new EventEmitter<SidenavToggle>()

  constructor(
    private router: Router
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth
    if (this.screenWidth <= 768) {
      this.collapsed = false
      this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed
    this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav() {
    this.collapsed = false
    this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item)
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData) {
    return this.router.url.includes(data.routerLink) ? 'active' : ''
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false
        }
      }
    }
  }
}
