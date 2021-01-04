import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../jApp/app/app.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';
import { UtilityService } from '../../../jIonic/utility.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  profileform: FormGroup;
  billingform: FormGroup;
  shippingform: FormGroup;

  constructor(public navCtrl: NavController, public app: AppService, public utility: UtilityService, private restApi: RestApiService) { }

  ngOnInit() {
  
  }

  editProfile() {
    this.navCtrl.navigateForward('/home/user-profile')
  }
  addbillingAddress() {
    this.navCtrl.navigateForward('/home/billingaddress')

  }
  addshippingAddress() {
    this.navCtrl.navigateForward('/home/shippingAddress')
  }

  userPic(name) {
    return this.restApi.domain + '/public/uploads/' + name; 
  }
}
