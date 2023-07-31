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
    <div cdkDropListGroup class="tab-menu-wrapper" *ngIf="tabMenus.length">
      <div cdkDropList (cdkDropListDropped)="drop($event)" class="d-flex" cdkDropListOrientation="horizontal">
        <div class="tab-menu-item" *ngFor="let menu of tabMenus;let i = index" cdkDrag (click)="handleNavigate(menu)">
          <span class="text-1 font-sm-regular me-2">{{ menu.label }}</span>
          <i class="pi pi-times cursor-pointer"
             (click)="handleCloseTab($event,menu,i)"></i>
        </div>
      </div>
    </div>`,
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

  tabMenus: INavbarData[] = []
  subscription: Subscription

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
