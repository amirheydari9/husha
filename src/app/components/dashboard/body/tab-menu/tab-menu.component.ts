import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AppConfigService} from "../../../../utils/app-config.service";
import {INavbarData} from "../../navbar-data.interface";
import {CdkDragDrop, moveItemInArray,} from '@angular/cdk/drag-drop';
import {Router} from "@angular/router";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

export class TabMenuItemDTO {
  constructor(
    public label: string,
    public routerLink: string
  ) {
  }
}

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-tab-menu',
  template: `
    <div class="position-relative mb-3">
      <div cdkDropListGroup class="tab-menu-wrapper" oncontextmenu="return false" *ngIf="tabMenus.length">
        <div cdkDropList (cdkDropListDropped)="drop($event)" class="flex" cdkDropListOrientation="horizontal">
          <div class="tab-menu-item" *ngFor="let menu of tabMenus;let i = index" cdkDrag
               (mouseup)="detectRightClick($event,menu)">
            <a class="text-1" [ngClass]="[router.url === menu.routerLink ? 'font-xs-bold' :'font-xs-medium']"
               routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
               [routerLink]="menu.routerLink">{{ menu.label }}</a>
            <i class="pi pi-times cursor-pointer mr-3" (click)="handleCloseTab($event,menu,i)"></i>
          </div>
        </div>
      </div>
      <div #contextMenu class="contextMenu" [ngStyle]="rightPanelStyle">
        <ul class="menu">
          <li *ngFor="let item of contextMenuItems" (click)="item.action()" class="flex align-items-center">
            <!--            <i class="me-1" [ngClass]="item.icon"></i>-->
            <a class="text-1 font-xs-regular">{{item.label}}</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

  tabMenus: TabMenuItemDTO[] = []
  subscription: Subscription[] = []
  rightPanelStyle: any = {}
  contextTabManu: TabMenuItemDTO

  @ViewChild('contextMenu') contextMenu: ElementRef;

  contextMenuItems = [
    {icon: 'pi pi-times', label: 'بستن تب های دیگر', action: () => this.closeOtherTabs()},
    {icon: 'pi pi-times', label: 'بستن همه تب ها', action: () => this.closeAllTabs()},
    {icon: 'pi pi-times', label: 'باز کردن در تب جدید', action: () => this.handleOpenNewWindow(false)},
    {icon: 'pi pi-times', label: 'باز کردن در مرورگر جدید', action: () => this.handleOpenNewWindow()},
  ]

  constructor(
    private appConfigService: AppConfigService,
    public router: Router,
  ) {
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event) {
    if (event.target !== this.contextMenu.nativeElement) this.closeContextMenu();
  }

  ngOnInit(): void {
    this.subscription.push(
      this.appConfigService.tabMenu().subscribe((data) => {
        const tab = this.tabMenus.find(tab => tab.routerLink == data.routerLink)
        if (!tab) this.tabMenus.push(data)
      })
    )
    this.subscription.push(
      this.appConfigService.onResetTabMenu().subscribe(() => {
        this.tabMenus = []
      })
    )
    this.closeContextMenu()
  }

  drop(event: CdkDragDrop<INavbarData[]>): void {
    moveItemInArray(this.tabMenus, event.previousIndex, event.currentIndex);
  }

  handleCloseTab($event: MouseEvent, menu: TabMenuItemDTO, i: number) {
    $event.preventDefault()
    this.tabMenus = this.tabMenus.filter(item => item.routerLink !== menu.routerLink)
    if (this.router.url === menu.routerLink) {
      this.tabMenus.length
        ? this.router.navigate([this.tabMenus[i == 0 ? 0 : i - 1].routerLink])
        : this.router.navigate(['/'])
    }
  }

  detectRightClick($event, menu) {
    if ($event.which === 3) {
      this.rightPanelStyle = {
        'display': 'block',
        'position': 'absolute',
        'left.px': $event.clientX - 200,
        'top.px': 61,
      }
      this.contextTabManu = menu
    }
  }

  closeContextMenu() {
    this.rightPanelStyle = {
      'display': 'none'
    }
  }

  closeOtherTabs() {
    this.closeContextMenu()
    this.tabMenus = this.tabMenus.filter(item => item.routerLink === this.contextTabManu.routerLink)
    this.router.navigate([this.contextTabManu.routerLink])
  }

  async closeAllTabs() {
    this.closeContextMenu()
    this.tabMenus = []
    await this.router.navigate(['/'])
  }

  closeCurrentTab() {
    this.closeContextMenu()
  }

  handleOpenNewWindow(isNewWindow: boolean = true) {
    const tabMenu = this.tabMenus.find(menu => menu.routerLink === this.contextTabManu.routerLink)
    window.open(new URL(window.location.href).origin + tabMenu.routerLink, '_blank', isNewWindow ? 'location=yes,scrollbars=yes,status=yes' : '')
  }
}
