import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PanelComponent} from "./panel.component";
import {PanelResolver} from "../../resolvers/panel.resolver";

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    resolve: {routeResolver: PanelResolver},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'base-form/:id',
        loadChildren: () => import('./pages/base-form/base-form.module').then(m => m.BaseFormModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PanelResolver]
})
export class PanelRoutingModule {
}
