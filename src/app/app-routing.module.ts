import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsLoggedInGuard} from "./guards/is-logged-in.guard";
import {IsNotLoggedInGuard} from "./guards/is-not-logged-in.guard";
import {CustomPreloadStrategyService} from "./utils/custom-preload-strategy.service";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/pages/panel/panel.module').then(m => m.PanelModule),
    canActivate: [IsLoggedInGuard]
  },
  // {
  //   path: '',
  //   loadChildren: () => import('../app/pages/ui-kit-list/ui-kit-list.module').then(m => m.UiKitListModule),
  //   // canActivate: [IsLoggedInGuard]
  // },
  {
    path: 'auth',
    loadChildren: () => import('../app/pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [IsNotLoggedInGuard]
  },
  {
    path: 'error',
    loadChildren: () => import('../app/pages/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo: '/error/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadStrategyService,
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
