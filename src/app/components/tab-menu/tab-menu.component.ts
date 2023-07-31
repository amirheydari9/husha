import {Component, NgModule, OnInit} from '@angular/core';
import {AppConfigService} from "../../utils/app-config.service";
import {INavbarData} from "../dashboard/navbar-data.interface";
import {CommonModule} from "@angular/common";
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import {Router} from "@angular/router";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe()
@Component({
  selector: 'app-tab-menu',
  template: `
    <div cdkDropListGroup class="tab-menu-wrapper" oncontextmenu="return false" *ngIf="tabMenus.length">
      <div cdkDropList (cdkDropListDropped)="drop($event)" class="d-flex" cdkDropListOrientation="horizontal">
        <div class="tab-menu-item" *ngFor="let menu of tabMenus;let i = index" cdkDrag (click)="handleNavigate(menu)"
             (mouseup)="detectRightClick($event,menu)">
          <span class="text-1 font-sm-regular me-2">{{ menu.label }}</span>
          <i class="pi pi-times cursor-pointer" (click)="handleCloseTab($event,menu,i)"></i>
        </div>
      </div>
    </div>
    <div id="contextMenu" class="contextMenu" [ngStyle]="rightPanelStyle" (mouseleave)="closeContextMenu()">
      <ul class="menu">
        <li (click)="closeOtherTabs()" class="d-flex align-items-center">
          <i class="pi pi-times me-1"></i>
          <a class="text-1 font-xs-regular">بستن تب های دیگر</a>
        </li>
        <li (click)="closeAllTabs()" class="d-flex align-items-center">
          <i class="pi pi-times me-1"></i>
          <a class="text-1 font-xs-regular">بستن همه تب ها</a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

  tabMenus: INavbarData[] = []
  subscription: Subscription
  rightPanelStyle: any = {}
  contextTabManu: INavbarData

  constructor(
    private appConfigService: AppConfigService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.appConfigService.tabMenu().subscribe((data) => {
      if (!this.tabMenus.length || (this.tabMenus.length && !this.tabMenus.includes(data))) {
        this.tabMenus.push(data)
      }
    })
    this.closeContextMenu()
  }

  drop(event: CdkDragDrop<INavbarData[]>): void {
    moveItemInArray(this.tabMenus, event.previousIndex, event.currentIndex);
  }

  handleCloseTab($event: MouseEvent, menu: INavbarData, i: number) {
    $event.preventDefault()
    this.tabMenus = this.tabMenus.filter(item => item.id !== menu.id)
    if (this.router.url.includes(menu.routerLink)) {
      this.tabMenus.length
        ? this.router.navigate([this.tabMenus[i - 1].routerLink])
        : this.router.navigate(['/'])
    }
  }

  handleNavigate(menu: INavbarData) {
    this.router.navigate([menu.routerLink])
  }

  detectRightClick($event, menu) {
    if ($event.which === 3) {
      this.rightPanelStyle = {
        'display': 'block',
        'position': 'absolute',
        'left.px': $event.clientX - 75,
        'top.px': $event.clientY - 62,
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
    this.tabMenus = this.tabMenus.filter(item => item.id === this.contextTabManu.id)
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
}

@NgModule({
  declarations: [TabMenuComponent],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [TabMenuComponent]
})
export class TabMenuModule {

}
