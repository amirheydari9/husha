import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UpdateService} from "./utils/update.service";

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
