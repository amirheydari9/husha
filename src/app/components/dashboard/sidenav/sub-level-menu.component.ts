import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {INavbarData} from "../navbar-data.interface";
import {fadeInOut, subMenu} from "../animations";
import {Router} from "@angular/router";
import {AppConfigService} from "../../../utils/app-config.service";

@Component({
  selector: 'app-sub-level-menu',
  template: `
    <ul class="subLevel-nav"
        [@submenu]="expanded
        ? {value :'visible',params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)',height:'*'}}
        : {value :'hidden',params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)',height:'0'}}"
        *ngIf="collapsed && data.items && data.items.length > 0">
      <li class="subLevel-nav-item" *ngFor="let item of data.items">
        <a class="subLevel-nav-link"
           [ngClass]="getActiveClass(item)"
           (click)="handleClick(item)"
           *ngIf="item.items && item.items.length > 0">
          <i class="subLevel-link-icon fa fa-circle"></i>
          <span class="subLevel-link-text" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
          <i *ngIf="item.items && collapsed" class="menu-collapsed-icon"
             [ngClass]="item.expanded ? 'fal fa-angle-down' :'fal fa-angle-left'"></i>
        </a>
        <a *ngIf="!item.items || (item.items && item.items.length === 0)"
           #subMenu
           (click)="handleSelectMenu(item)"
           class="subLevel-nav-link"
           [routerLink]="[item.routerLink]"
           routerLinkActive="active-subLevel"
           [routerLinkActiveOptions]="{exact:true}">
          <i class="subLevel-link-icon fa fa-circle"></i>
          <span class="subLevel-link-text font-xs-regular" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
        </a>
        <ng-container *ngIf="item.items && item.items.length > 0">
          <app-sub-level-menu
            [data]="item"
            [collapsed]="collapsed"
            [multiple]="multiple"
            [expanded]="item.expanded"
          ></app-sub-level-menu>
        </ng-container>
      </li>
    </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [fadeInOut, subMenu]
})
export class SubLevelMenuComponent implements OnInit {

  @Input() data: INavbarData
  @Input() collapsed: boolean = false
  @Input() animating: boolean | undefined
  @Input() expanded: boolean | undefined
  @Input() multiple: boolean = false

  @ViewChild('subMenu') subMenu: ElementRef

  constructor(
    private router: Router,
    private appConfigService: AppConfigService
  ) {
  }

  ngOnInit(): void {
  }

  handleClick(item: INavbarData): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false
          }
        }
      }
    }
    item.expanded = !item.expanded
  }

  getActiveClass(item: INavbarData) {
    return item.expanded && this.router.url === item.routerLink ? 'active-subLevel' : ''
  }

  handleSelectMenu(item: INavbarData) {
    if (item.items.length === 0) this.appConfigService.setTabMenu(item)
  }
}
