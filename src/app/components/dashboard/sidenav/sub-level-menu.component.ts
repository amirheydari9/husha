import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {INavbarData} from "../navbar-data.interface";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {fadeInOut} from "../animations";
import {Router} from "@angular/router";

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
           class="subLevel-nav-link"
           [routerLink]="[item.routerLink]"
           routerLinkActive="active-subLevel"
           [routerLinkActiveOptions]="{exact:true}">
          <i class="subLevel-link-icon fa fa-circle"></i>
          <span class="subLevel-link-text" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
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
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({height: '0', overflow: 'hidden'})),
      state('visible', style({height: '*'})),
      transition('visible <=> hidden', [
        style({overflow: 'hidden'}),
        animate('{{transitionParams}}'),
      ]),
      transition('void => *', [
        animate(0),
      ]),
    ])
  ]
})
export class SubLevelMenuComponent implements OnInit {

  @Input() data: INavbarData
  @Input() collapsed: boolean = false
  @Input() animating: boolean | undefined
  @Input() expanded: boolean | undefined
  @Input() multiple: boolean = false

  constructor(
    private router: Router
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
    return item.expanded && this.router.url.includes(item.routerLink) ? 'active-subLevel' : ''
  }

}
