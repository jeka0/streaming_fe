import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';

const routes: Routes = [
  {
    path: 'login',
    //canActivate: [loginGuard],
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'registration',
    //canActivate: [loginGuard],
    component: RegistrationComponent,
    title: 'Registration',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
