import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../jApp/app/app.service';
import { NavigatorService } from '../../../jApp/navigator.service';

@Component({
  selector: 'app-ordertrack',
  templateUrl: './ordertrack.page.html',
  styleUrls: ['./ordertrack.page.scss'],
})
export class OrdertrackPage implements OnInit {

  order:any = {};
  errorMessage = '';
  trackData:any = [];
  productPassed:any = {};
  constructor(public app: AppService, public navCtrl: NavController, public navigator: NavigatorService) { }

  ngOnInit() {
    this.order = this.navigator.navigationData.order;
    this.productPassed = this.navigator.navigationData.product;
    console.log(this.order, this.order.line_items[0]['courier_details']['booking_id']);
    if(typeof this.order.id == 'undefined') {
      this.navCtrl.navigateRoot('home');
    }
    // const crData = {"ReadJTSVTrackDetailsResult":[{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"SIGN","REMARKS":"","STATUSCODE":"POD","STATUSDATE":"12\/17\/2020 12:00:00 AM","STATUSTIME":"13:30"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Out For Delivery","STATUSCODE":"OUT","STATUSDATE":"12\/17\/2020 12:00:00 AM","STATUSTIME":"11:48"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Area Changed","STATUSCODE":"ARC","STATUSDATE":"12\/16\/2020 12:00:00 AM","STATUSTIME":"15:46"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Out For Delivery","STATUSCODE":"OUT","STATUSDATE":"12\/16\/2020 12:00:00 AM","STATUSTIME":"10:36"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"No Response","STATUSCODE":"NR","STATUSDATE":"12\/15\/2020 12:00:00 AM","STATUSTIME":"14:15"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Out For Delivery","STATUSCODE":"OUT","STATUSDATE":"12\/15\/2020 12:00:00 AM","STATUSTIME":"12:14"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Shipment Arrrived at ERNAKULAM","STATUSCODE":"ARV","STATUSDATE":"12\/12\/2020 12:00:00 AM","STATUSTIME":"11:27"},{"AWBNO":"P45600012","BRANCH":"","RECEIVER":"","REMARKS":"Shipment Manifested","STATUSCODE":"MAN","STATUSDATE":"12\/12\/2020 12:00:00 AM","STATUSTIME":"10:10"}]};
    // this.trackData = crData.ReadJTSVTrackDetailsResult.reverse();
    // console.log(this.trackData);
    if (this.order.line_items[0]['courier'] === 1 && this.order.line_items[0]['courier_details']['booking_id']) {
      //P45600012
      this.app.api.getOrderCourierDetails(this.order.line_items[0]['courier_details']['booking_id']).subscribe(res => {
        if (res.status === 'success') {
          this.trackData = res.result.reverse();
        } else {
          this.errorMessage = 'no data';
        }
      });
    }
  }

}
