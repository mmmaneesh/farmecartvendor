import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilityService } from '../../../jIonic/utility.service';
import { NavController } from '@ionic/angular';
import { NavigatorService } from '../../../jApp/navigator.service';
import { ApiService } from '../../../jApp/server/api.service';
import { AppService } from '../../../jApp/app/app.service';
import { OneSignalService } from '../../../jApp/service/onesignal.service';
import { SmsReceiverService } from '../../../jIonic/sms-receiver.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit, OnDestroy {

  signin: {
    mobile: string,
    otp: string,
    cks: any,
    details: any,
    type: string
  } = {
    mobile: '',
    otp: '',
    cks: '',
    details: '',
    type: 'vendor'
  };

  otp = {
    a: '',
    b: '',
    c: '',
    d: ''
  }; 

  OTPInterval: any;

  constructor(public utility: UtilityService, public navCrtl: NavController, public navigator: NavigatorService, private smsReader: SmsReceiverService,
    public app: AppService, public OneSignal: OneSignalService, public api: ApiService,) { }

  ngOnInit() {
    if(this.navigator.processName == 'signin')
    {
      this.signin = Object.assign({}, this.navigator.navigationData);

      this.navigator.navigationData = {};
      this.navigator.processName = '';
    } else {
      this.navCrtl.navigateRoot('/');
    }

    this.smsReader.start();
  
    this.OTPInterval =  setInterval(() => {
      //this.utility.toast('sms reader otp -> ' + this.smsReader.OTP);
      if(typeof this.smsReader.OTP != 'undefined' &&  this.smsReader.OTP != null && this.smsReader.OTP != '') {        
        this.otp.a = this.smsReader.OTP[0];
        this.otp.b = this.smsReader.OTP[1];
        this.otp.c = this.smsReader.OTP[2];
        this.otp.d = this.smsReader.OTP[3];

        let a: any = document.getElementById('a');
        let b: any = document.getElementById('b');
        let c: any = document.getElementById('c');
        let d: any = document.getElementById('d');
        a.value = this.smsReader.OTP[0];
        b.value = this.smsReader.OTP[1];
        c.value = this.smsReader.OTP[2];
        d.value = this.smsReader.OTP[3];

        this.checkOtp();

        this.smsReader.OTP = null;
        clearInterval(this.OTPInterval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.OTPInterval);
  }

  goNext(e) {

    let target = e.srcElement || e.target;

    // const charCode = e.key;
    // if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace"].includes(charCode) === false) {
    //   target.value = "";
    //   return false;
    // }

    // const charCode = (e.which) ? e.which : e.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   target.value = "";
    //   return false;
    // }

    let maxLength = 1;
    let myLength = target.value.length;
    if (myLength >= maxLength) {
        target.value = target.value.charAt(target.value.length-1)
        let next = target;
        while (next = next.nextElementSibling) {
            if (next == null)
                break;
            if (next.tagName.toLowerCase() === "input") {
                next.focus();
                break;
            }
        }
    }
    // Move to previous field if empty (user pressed backspace)
    else if (myLength === 0) {
        let myLength = target.value.length;
        if(myLength == 0) {
          let previous = target;
          while (previous = previous.previousElementSibling) {
              if (previous == null)
                  break;
              if (previous.tagName.toLowerCase() === "input") {
                  previous.focus();
                  break;
              }
          }
        }
    }
  }

  checkOtp() {
    // let otp = this.otp.a.toString() + this.otp.b.toString() + this.otp.c.toString() + this.otp.d.toString();
    let a: any = document.getElementById('a');
    let b: any = document.getElementById('b');
    let c: any = document.getElementById('c');
    let d: any = document.getElementById('d');

    let otp = a.value + b.value + c.value + d.value;

    if(otp == this.signin.otp) 
    {
      this.utility.getDeviceAccounts().then(data => {
        this.signin.details = data;
      });

      const hsh = 3254*parseInt(otp)*parseInt(otp);
      this.signin.cks =  hsh;

      this.signin.type = 'vendor';

      this.utility.loader('Please Wait...');
      this.api.signin(this.signin).subscribe(res => {
        this.utility.loaderDismiss();
        if(res && res.status == 'success') {
         localStorage.setItem('validateUser', res.data.token);
         this.app.doLogin({ user:  res.data.user, detail: res.data.detail});
         this.OneSignal.OneSignalInit();
        } else {
          if(res.validator) {
            let message = '';
            for(let x in res.validator) {
              message = message + res.validator[x][0] + '\n';
            }
            this.utility.toast(message);
          } else if(res.message){
            this.utility.toast(res.message);
            this.navCrtl.navigateRoot('/');
          }
          else {
            this.utility.toast('Something went wrong.');
          }
        }
      }, error => {
        this.utility.loaderDismiss();
        this.utility.toast('Something went wrong.');
      });
    } else {
      this.utility.toast('Invaild OTP');
    }
  }
}
