import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopdetailPageRoutingModule } from './shopdetail-routing.module';

import { ShopdetailPage } from './shopdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopdetailPageRoutingModule
  ],
  declarations: [ShopdetailPage]
})
export class ShopdetailPageModule {}
