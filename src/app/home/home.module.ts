import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppService } from '../../jApp/app/app.service';
import { ProductdetailPage } from './productdetail/productdetail.page';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { WhatsappIconComponent } from './components/whatsapp-icon/whatsapp-icon.component';
import { PincodeOuterComponent } from './components/pincode-outer/pincode-outer.component';
import { ChangePincodeComponent } from '../change-pincode/change-pincode.component';
import { HeartComponent } from './components/heart/heart.component';
import { ContactusComponent } from './contactus/contactus.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CategoryWiseComponent } from './category-wise/category-wise.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';
import { ReviewsPage } from './reviews/reviews.page';
import { Ionic4DatepickerModule } from "@logisticinfotech/ionic4-datepicker";
import { OrderHistoryComponent } from './order-history/order-history.component';
import { BgImgDirective } from '../bg-img.directive';
import { CategoriesComponent } from './categories/categories.component';



@NgModule({
  declarations: [HomeComponent, WelcomeComponent, ProductdetailPage,OrderHistoryComponent,
    DashboardComponent, OrderDetailComponent,MyProfileComponent,UserProfileComponent,BillingAddressComponent,
    CartIconComponent, WhatsappIconComponent, PincodeOuterComponent, 
    ChangePincodeComponent, HeartComponent, ContactusComponent, CategoryWiseComponent, ReviewsPage, 
    BgImgDirective, CategoriesComponent   ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    IonicModule,
    FormsModule,
    Ionic4DatepickerModule,

  ],
  entryComponents: []
})
export class HomeModule { 
  constructor(private app: AppService, private navCrtl: NavController) {
    if(!this.app.isLogin()) this.navCrtl.navigateRoot('/auth');
  }
}
