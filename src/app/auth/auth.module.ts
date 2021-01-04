import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { OtpPage } from './otp/otp.page';
import { AppService } from '../../jApp/app/app.service';


@NgModule({
  declarations: [SigninComponent, OtpPage],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    IonicModule,
  ]
})
export class AuthModule { 
  constructor(private app: AppService, private navCrtl: NavController) {
    if(this.app.isLogin()) this.navCrtl.navigateRoot('home');
  }
}
