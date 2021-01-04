import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { OtpPage } from './otp/otp.page';

const routes: Routes = [
  { path: '', component: SigninComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'otp', component: OtpPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
