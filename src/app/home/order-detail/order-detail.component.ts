import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigatorService } from '../../../jApp/navigator.service';
import { AppService } from '../../../jApp/app/app.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order:any = {};
  billingAddress:any;
  shippingAddress:any;

  constructor(public navCtrl: NavController, public navigator: NavigatorService,public app: AppService, public restApi: RestApiService) { }

  ngOnInit() {
    this.order = this.navigator.navigationData;
    this.billingAddress=this.order.billing;
    this.shippingAddress=this.order.shipping;
    if(typeof this.order.id == 'undefined') {
      this.home();
    }
  }

  home() {
    this.navCtrl.navigateRoot('home');
  }

  dateFormat(date) {
    return date.substring(0, 10);
  }

  trackOrder(data) {
    this.navigator.navigationData = {order: this.order, product: data};
    this.navCtrl.navigateForward('home/ordertrack');
  }

  cancelOrder() {
    this.app.api.cancelOrder({order_id: this.order.id}).subscribe((res) => {
        try{
          if(res.status == 'success') {
            this.app.utility.toast("Order cancelled");
            this.order.status = 'cancelled';

          } else {
            this.app.utility.toast(res.message);
          }
        } catch(e) {
          this.app.utility.toast("Something went wrong");
        }
    });
  }
}
