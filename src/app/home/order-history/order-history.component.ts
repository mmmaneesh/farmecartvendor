import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../jApp/app/app.service';
import { NavigatorService } from '../../../jApp/navigator.service';
import { NavController } from '@ionic/angular';

import * as moment from 'moment';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {

  orders: Array<any> = [];
  fetchingProducts: boolean = false;

  constructor(public app: AppService, public navigator: NavigatorService, public navCrtl: NavController) { }

  ngOnInit() {
    this.fetchingProducts = true;
    this.app.api.getOrders({customer: this.app.state.user.id}).subscribe(res => {
      this.orders = res.data;
      this.fetchingProducts = false;
    });
  }

  openOrderDetail(x) {
    this.navigator.navigationData = x;
    this.navCrtl.navigateForward('home/order-detail');
  }

  dateFormat(date) {
    return date.substring(0, 10);
  }
}
