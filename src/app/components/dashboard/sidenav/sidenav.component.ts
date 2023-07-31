import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {INavbarData} from "../navbar-data.interface";
import {fadeInOut, rotate} from "../animations";
import {Router} from "@angular/router";
import {BaseInfoFacade} from "../../../data-core/base-info/base-info.facade";
import {AutoUnsubscribe} from "../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {IMenuRes} from "../../../models/interface/menu-res.interface";
import {AppConfigService} from "../../../utils/app-config.service";

export interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean
}

@AutoUnsubscribe()
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [fadeInOut, rotate]
})
export class SidenavComponent implements OnInit {

  collapsed: boolean = false;
  screenWidth = 0;
  navData = []
  multiple: boolean = false
  subscription: Subscription

  @Output() onToggleSidenav: EventEmitter<SidenavToggle> = new EventEmitter<SidenavToggle>()

  constructor(
    private router: Router,
    private baseInfoFacade: BaseInfoFacade,
    private appConfigService: AppConfigService
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

  async ngOnInit(): Promise<void> {
    this.screenWidth = window.innerWidth
    this.subscription = this.baseInfoFacade.menu$.subscribe(data => {
      this.navData = data.map(menu => this.transformMenu(menu))
    })
    await this.baseInfoFacade.fetchMenu()
  }

  transformMenu(menu: IMenuRes): INavbarData {
    const {title, subMenus, id, name, ...rest} = menu;
    return {
      id: id,
      label: title,
      routerLink: '/base-form/' + id,
      items: subMenus && subMenus.length > 0 ? subMenus.map(this.transformMenu.bind(this)) : [],
      expanded: false,
      name: name,
    };
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
    if (item.items.length === 0) this.appConfigService.setTabMenu(item)
    const sideNavLinks = document.getElementsByClassName('sidenav-nav-link')
    for (let i = 0; i < sideNavLinks.length; i++) {
      sideNavLinks[i].classList.remove('active')
    }
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false
        }
      }
    }
  }
}
