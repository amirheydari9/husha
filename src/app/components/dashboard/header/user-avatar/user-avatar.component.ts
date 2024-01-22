import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {OauthFacade} from "../../../../data-core/oauth/oauth.facade";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-avatar',
  template: `
    <p-avatar image="assets/user3.jpg" [shape]="'circle'" (click)="menu.toggle($event)"></p-avatar>
    <p-menu #menu [model]="items" [popup]="true"></p-menu>
  `,
  styles: []
})
export class UserAvatarComponent implements OnInit {

  subscription: Subscription
  items: MenuItem[] = [
    {
      label: 'مدیریت پروفابل',
      icon: 'pi pi-user'
    },
    {separator: true},
    {
      label: 'خروج',
      icon: 'pi pi-power-off',
      command: () => this.oauthFacade.logout()
    }
  ]

  constructor(
    private oauthFacade: OauthFacade,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.oauthFacade.fetchUserAvatar()
    this.subscription = this.oauthFacade.userAvatar$.subscribe(data => {
      console.log(data)
    })
  }

}
