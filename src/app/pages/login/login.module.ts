import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LoginService } from './login.service';
import { AuthGuard } from './auth.guard';

export const routes = [
  { path: '', component: LoginComponent },
  { path: 'forgotpw', component: ForgotPasswordComponent },
  { path: 'changepw', component: ChangePasswordComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ],
  providers: [CookieService, LoginService, AuthGuard]
})
export class LoginModule { }