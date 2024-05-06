import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { NotAuthGuard } from './shared/guards/not-auth.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { LiveGuard } from './shared/guards/live.guard';
import { HasUserGuard } from './shared/guards/has-user.guard';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { StreamComponent } from './pages/stream/stream.component';
import { HomeComponent } from './pages/home/home.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { UserComponent } from './pages/user/user.component';
import { Page404Component } from './pages/page404/page404.component';
import { WrapperSettingsComponent } from './pages/wrapper-settings/wrapper-settings.component';
import { StreamSettingsComponent } from './pages/stream-settings/stream-settings.component'; 
import { ModersListComponent } from './pages/moders-list/moders-list.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [NotAuthGuard],
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'registration',
    canActivate: [NotAuthGuard],
    component: RegistrationComponent,
    title: 'Registration',
  },
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    title: 'MyStreaming',
    children:[
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'settings',
        component: WrapperSettingsComponent,
        children:[
          {
            path: '',
            component: UserSettingsComponent,
          },
          {
            path: 'stream',
            component: StreamSettingsComponent,
          },
          {
            path: 'moders',
            component: ModersListComponent,
          },
        ]
      },
      {
        path: 'error404',
        component: Page404Component
      },
      {
        path: ':name',
        canActivate: [HasUserGuard],
        component: UserComponent,
      },
      {
        path: ':name/live',
        canActivate: [HasUserGuard, LiveGuard],
        component: StreamComponent,
      },
      {
        path: ':name/:video',
        canActivate: [HasUserGuard],
        component: StreamComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
