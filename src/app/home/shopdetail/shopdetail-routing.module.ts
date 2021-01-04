import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopdetailPage } from './shopdetail.page';

const routes: Routes = [
  {
    path: '',
    component: ShopdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopdetailPageRoutingModule {}
