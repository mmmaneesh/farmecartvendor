import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdertrackPageRoutingModule } from './ordertrack-routing.module';

import { OrdertrackPage } from './ordertrack.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdertrackPageRoutingModule
  ],
  declarations: [OrdertrackPage]
})
export class OrdertrackPageModule {}
