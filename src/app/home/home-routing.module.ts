import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProductdetailPage } from './productdetail/productdetail.page';
import { ChangePincodeComponent } from '../change-pincode/change-pincode.component';
import { ContactusComponent } from './contactus/contactus.component';
import { CategoryWiseComponent } from './category-wise/category-wise.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReviewsPage } from './reviews/reviews.page';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CategoriesComponent } from './categories/categories.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: WelcomeComponent },
      {
        path: 'productdetail/:id',
        component: ProductdetailPage
      },
      {
        path: 'productdetail',
        component: ProductdetailPage
      },
      {
        path: 'change-pincode',
        component: ChangePincodeComponent
      },
      {
        path: 'contactus',
        component: ContactusComponent
      },
      {
        path: 'categoryWise',
        component: CategoryWiseComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'sub-categories',
        component: CategoriesComponent
      },
      

      {
        path: 'order-detail',
        component: OrderDetailComponent
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },

      {
        path: 'myProfile',
        component: MyProfileComponent
      },
      {
        path: 'billingaddress',
        component: BillingAddressComponent
      },
      {
        path: 'reviews/:id',
        component: ReviewsPage
      },
      {
        path: 'orderhistory',
        component:OrderHistoryComponent
      },
      {
        path: 'shopdetail',
        loadChildren: () => import('./shopdetail/shopdetail.module').then(m => m.ShopdetailPageModule)
      },
      {
        path: 'ordertrack',
        loadChildren: () => import('./ordertrack/ordertrack.module').then(m => m.OrdertrackPageModule)
      },


    ]
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
