import {Component, ElementRef, NgModule, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AppConfigService} from "../../utils/app-config.service";
import {INavbarData} from "../dashboard/navbar-data.interface";
import {CommonModule} from "@angular/common";
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import {Router, RouterModule} from "@angular/router";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-tab-menu',
  template: `
    <div class="position-relative mb-3">
      <div cdkDropListGroup class="tab-menu-wrapper" oncontextmenu="return false" *ngIf="tabMenus.length">
        <div cdkDropList (cdkDropListDropped)="drop($event)" class="flex" cdkDropListOrientation="horizontal">
          <div class="tab-menu-item" *ngFor="let menu of tabMenus;let i = index" cdkDrag
               (mouseup)="detectRightClick($event,menu)">
            <a class="text-1 me-2" [ngClass]="[router.url === menu.routerLink ? 'font-sm-bold' :'font-sm-regular']"
               routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
               [routerLink]="menu.routerLink">{{ menu.label }}</a>
            <i class="pi pi-times cursor-pointer" (click)="handleCloseTab($event,menu,i)"></i>
          </div>
        </div>
      </div>
      <div #contextMenu class="contextMenu" [ngStyle]="rightPanelStyle">
        <ul class="menu">
          <li (click)="closeOtherTabs()" class="flex align-items-center">
            <i class="pi pi-times me-1"></i>
            <a class="text-1 font-xs-regular">بستن تب های دیگر</a>
          </li>
          <li (click)="closeAllTabs()" class="flex align-items-center">
            <i class="pi pi-times me-1"></i>
            <a class="text-1 font-xs-regular">بستن همه تب ها</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

  tabMenus: INavbarData[] = []
  subscription: Subscription[] = []
  rightPanelStyle: any = {}
  contextTabManu: INavbarData

  @ViewChild('contextMenu') contextMenu: ElementRef;

  constructor(
    private appConfigService: AppConfigService,
    public router: Router,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.subscription.push(
      this.appConfigService.tabMenu().subscribe((data) => {
        if (!this.tabMenus.length || (this.tabMenus.length && !this.tabMenus.includes(data))) this.tabMenus.push(data)
      })
    )
    this.subscription.push(
      this.appConfigService.onResetTabMenu().subscribe(() => {
        this.tabMenus = []
      })
    )
    this.closeContextMenu()
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.contextMenu.nativeElement) this.closeContextMenu()
    });
  }

  drop(event: CdkDragDrop<INavbarData[]>): void {
    moveItemInArray(this.tabMenus, event.previousIndex, event.currentIndex);
  }

  handleCloseTab($event: MouseEvent, menu: INavbarData, i: number) {
    $event.preventDefault()
    this.tabMenus = this.tabMenus.filter(item => item.id !== menu.id)
    if (this.router.url === menu.routerLink) {
      this.tabMenus.length
        ? this.router.navigate([this.tabMenus[i - 1].routerLink])
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
    RouterModule,
  ],
  exports: [TabMenuComponent]
})
export class TabMenuModule {

}
