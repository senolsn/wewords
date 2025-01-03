import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthorizationGuard } from './core/guards/authorization.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthorizationGuard],
    children: [
      
      {
        path: 'tanimlar', loadChildren: () => import('./modules/tanimlar/tanimlar.module').then(m => m.TanimlarModule),
        canActivate: [AuthorizationGuard]
      },
    ]
  },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
