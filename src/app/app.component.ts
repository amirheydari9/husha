import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UpdateService} from "./utils/update.service";

import {LicenseManager} from "ag-grid-enterprise";
LicenseManager.setLicenseKey('[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-052646}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{29 February 2024}____[v3]_[0102]_MTcwOTE2NDgwMDAwMA==b1896dfdfbb4dc28dfd4e4366ce39bbd')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'husha-erp-client';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private updateService: UpdateService,
  ) {
    this.updateService.checkForUpdates();
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute('ng-version')
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.activatedRoute.children) {
          const childRoutes = this.activatedRoute.children;
          childRoutes.forEach((childRoute) => {
            childRoute.routeConfig.children?.forEach((route) => {
              if (!route.canActivate && !route.canLoad && route.loadChildren) route.loadChildren();
            });
          });
        }
      }
    });
  }
}
