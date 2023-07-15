import {Component} from '@angular/core';
import {SidenavToggle} from "./sidenav/sidenav.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0

  onToggleSidenav($event: SidenavToggle) {
    this.isSideNavCollapsed = $event.collapsed;
    this.screenWidth = $event.screenWidth;
  }

}
