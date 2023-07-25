import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./auth.component";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: `/auth/login`
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'phone',
        loadChildren: () => import('./pages/phone/phone.module').then(m => m.PhoneModule),
      },
      {
        path: 'otp',
        loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpModule),
      },
      {
        path: 'forget-password',
        loadChildren: () => import('./pages/forget-password/forget-password.module').then(m => m.ForgetPasswordModule),
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
