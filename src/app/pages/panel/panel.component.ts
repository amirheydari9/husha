import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../services/app-config.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../decorators/AutoUnSubscribe";
import {TokenStorageService} from "../../services/token-storage.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthFacade} from "../../data-store/auth-store/auth.facade";
import {
  ChangePasswordBottomSheetComponent
} from "../../components/bottom-sheet/change-password-bottom-sheet/change-password-bottom-sheet.component";
import {PasswordType} from "../../config/enums";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {StorageService} from "../../services/storage.service";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {

  showBottomNavigation: boolean
  subscription: Subscription[] = []
  mainBackgroundColor: string

  constructor(
    private appConfigService: AppConfigService,
    private cdr: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private storageService: StorageService,
    private tokenStorageService: TokenStorageService,
  ) {
  }

  whiteMainBackGroundColorRoutes = [
    '/gateway', '/factor'
  ]

  showBottomNavigationRouts = [
    '/', '/repayment', '/burger-menu', '/transactions',
  ]

  ngOnInit(): void {
    this.handleShowBottomNavigation(this.router.url)
    this.handleMainBackgroundColor(this.router.url)
    this.cdr.detectChanges()
    this.subscription.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.handleShowBottomNavigation(event.url)
          this.handleMainBackgroundColor(event.url)
          this.cdr.detectChanges()
        }
      })
    )
    // if (!this.tokenStorageService.isPasswordSet() && !this.storageService.getSessionStorage('view-set-password')) {
    //   this.storageService.setSessionStorage('view-set-password', true)
    //   this.bottomSheet.open(ChangePasswordBottomSheetComponent, {data: PasswordType.SET_PASSWORD})
    // }
  }

  handleShowBottomNavigation(url: string): void {
    this.showBottomNavigationRouts.includes(url) ? this.showBottomNavigation = true : this.showBottomNavigation = false
  }

  handleMainBackgroundColor(url: string): void {
    this.whiteMainBackGroundColorRoutes.includes(url.split('?')[0]) ? this.mainBackgroundColor = 'white' : this.mainBackgroundColor = '#F8F9FB'
  }

}
