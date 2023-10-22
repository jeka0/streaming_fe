import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { NotAuthGuard } from './shared/guards/not-auth.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { StreamPlayerComponent } from './shared/components/stream-player/stream-player.component';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    title: 'MyStreaming',
    children:[
      {
        path: 'd',
        component: StreamPlayerComponent,
      }
    ]
  },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
