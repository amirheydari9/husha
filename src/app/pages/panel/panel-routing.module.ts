import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PanelComponent} from "./panel.component";
import {FormResolver} from "../../resolvers/form.resolver";

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
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
        path: 'form/:id/update/:data',
        loadChildren: () => import('./pages/update/update.module').then(m => m.UpdateModule),
        resolve: {data: FormResolver}
      },
      {
        path: 'base-info/:id',
        loadChildren: () => import('./pages/base-info/base-info.module').then(m => m.BaseInfoModule),
        resolve: {data: FormResolver}
      },
      {
        path: 'form/:id/import',
        loadChildren: () => import('./pages/import/import.module').then(m => m.ImportModule),
        resolve: {data: FormResolver}
      },
      {
        path: 'form/:id/create',
        loadChildren: () => import('./pages/create/create.module').then(m => m.CreateModule),
        resolve: {data: FormResolver}
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FormResolver]
})
export class PanelRoutingModule {
}
