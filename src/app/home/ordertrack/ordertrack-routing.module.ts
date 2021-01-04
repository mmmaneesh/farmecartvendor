import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdertrackPage } from './ordertrack.page';

const routes: Routes = [
  {
    path: '',
    component: OrdertrackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdertrackPageRoutingModule {}
