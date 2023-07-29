import {Component, NgModule, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";
import {OauthFacade} from "../../data-core/oauth/oauth.facade";

@Component({
  selector: 'app-user-avatar',
  template: `
    <p-avatar image="assets/user3.jpg" size="xlarge" [shape]="'circle'" (click)="menu.toggle($event)"></p-avatar>
    <p-menu #menu [model]="items" [popup]="true"></p-menu>
  `,
  styles: []
})
export class UserAvatarComponent implements OnInit {
  items: MenuItem[] = [
    {
      label: 'مدیریت پروفابل',
      icon: 'pi pi-user'
    },
    {separator: true},
    {
      label: 'خروج',
      icon: 'pi pi-fw pi-power-off',
      command: () => this.oauthFacade.logout()
    }
  ]

  constructor(
    private oauthFacade: OauthFacade
  ) {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [
    AvatarModule,
    MenuModule
  ],
  exports: [UserAvatarComponent]
})
export class UserAvatarModule {

}
