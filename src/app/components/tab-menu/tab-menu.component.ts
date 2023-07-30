import {Component, NgModule, OnInit} from '@angular/core';
import {AppConfigService} from "../../utils/app-config.service";
import {INavbarData} from "../dashboard/navbar-data.interface";
import {CommonModule} from "@angular/common";
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

  tabMenus: INavbarData[] = []

  constructor(
    private appConfigService: AppConfigService
  ) {
  }

  ngOnInit(): void {
    this.appConfigService.tabMenu().subscribe((data) => {

      if (this.tabMenus.length) {
        if (!this.tabMenus.includes(data)) {
          this.tabMenus.push(data)
        }
      } else {
        this.tabMenus.push(data)
      }
    })
  }

  drop(event: CdkDragDrop<INavbarData[]>): void {
    moveItemInArray(this.tabMenus, event.previousIndex, event.currentIndex);
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
