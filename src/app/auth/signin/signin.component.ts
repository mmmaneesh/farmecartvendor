import { Component, OnInit } from '@angular/core';
import { jValidator } from '../../../jCore/validator';
import { UtilityService } from '../../../jIonic/utility.service';
import { NavigatorService } from '../../../jApp/navigator.service';
import { AppService } from '../../../jApp/app/app.service';
import { OneSignalService } from '../../../jApp/service/onesignal.service';
import { ApiService } from '../../../jApp/server/api.service';
import { SmsService } from '../../../jApp/service/sms.service';
import { NavController } from '@ionic/angular';
import { SmsReceiverService } from '../../../jIonic/sms-receiver.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  intro = true;
  constructor(public navCtrl: NavController, public utility: UtilityService, public navigator: NavigatorService, private smsReader: SmsReceiverService,
    public app: AppService, public OneSignal: OneSignalService, public api: ApiService, public sms: SmsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.intro = false;
    }, 2000);
    this.smsReader.start();
  }

  signin: {
    mobile: string,
    otp: string,
  } = {
      mobile: '',
      otp: '',
    };

  isMobileVaild: boolean = false;
  isMobileTouch: boolean = false;

  validateMobile() {
    this.isMobileTouch = true;
    if (jValidator.mobile(this.signin.mobile)) {
      this.isMobileVaild = true;
    } else {
      this.isMobileVaild = false;
    }
  }

  onlynumber(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }


  login() {
    this.isMobileTouch = true;
    this.validateMobile();
    if (this.isMobileVaild) {
      this.utility.loader('Please Wait...');

      this.signin.otp = this.generateOTP();

      let message = "";
      if (this.smsReader.hash == null) {
        message = "Farmecart vendor login otp is " + this.signin.otp;
      } else {
        message = "Farmecart vendor login otp is " + this.signin.otp + "%0a<" + this.smsReader.hash + '>';
      }

      this.sms.send(this.signin.mobile, message).subscribe(res => {
        this.utility.loaderDismiss();
        this.navigator.navigationData = this.signin;
        this.navigator.processName = 'signin';
        this.navCtrl.navigateForward('auth/otp');
      }, error => {
        this.utility.loaderDismiss();
        this.navigator.navigationData = this.signin;
        this.navigator.processName = 'signin';
        this.navCtrl.navigateForward('auth/otp');
      });
    } else {
      this.utility.toast('Invaild Mobile Number');
    }
  }
}
