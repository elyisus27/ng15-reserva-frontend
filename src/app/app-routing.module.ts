import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { DefaultLayoutComponent } from './containers';

const routes: Routes = [
  // { path: 'home', component: HomeComponent },
  
  {
    path: 'login', component: LoginComponent, 
    // children: [
    //   {
    //     path: 'base',
    //     loadChildren: () =>
    //       import('./views/base/base.module').then((m) => m.BaseModule)
    //   },]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'home',
    component: DefaultLayoutComponent,
    data: {
      title: 'home'
    },
    children: [
      {
        path: 'mod',
        component: BoardModeratorComponent 
        // loadChildren: () =>  import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
    ]
  },
  // { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'user', component: BoardUserComponent },
  // { path: 'mod', component: BoardModeratorComponent },
  // { path: 'admin', component: BoardAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
