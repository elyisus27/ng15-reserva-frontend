import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { ProfileComponent } from './profile/profile.component';

import { BoardModeratorComponent } from './views/pages/portal/board-moderator/board-moderator.component';

import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './_guards/auth.guard';

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
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    // data: {
    //   title: 'home'
    // },
    children: [
      {
        path: 'mod',
        //component: BoardModeratorComponent ,  //testeando importar un modulo
        loadChildren: () => import('./views/pages/portal/portal.module').then(m => m.PortalModule),
      },
    ]
  },
  // { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'mod', component: BoardModeratorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

