import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { UtilityService } from './utility.service';
// ionic cordova plugin add cordova-plugin-sms-receive

@Injectable({
  providedIn: 'root'
})
export class SmsReceiverService {

  OTP: any = null;
  hash: any = null;

  constructor(public utility: UtilityService, private platform: Platform, private smsRetriever: SmsRetriever) { }

  start() {
    this.platform.ready().then(()=> {
      if(!this.platform.is('desktop'))
      {
        this.smsRetriever.getAppHash()
        .then((res: any) => {
          this.hash = res;
          //this.utility.toast('sms reader otp hash-> ' + res);
        })
        .catch((error: any) => {
          console.error(error)
          //this.utility.toast('sms reader otp hash error -> ');
        });
        
        this.smsRetriever.startWatching()
        .then((res: any) =>{
          this.processSMS(res.Message.toString());
        }) 
        .catch((error: any) => {
          console.error(error);
        });
      }
    });
  }

  processSMS(message) {
    if (message && message.search('Farmecart') != -1) {
      this.OTP = message.substring(54,58);
    }
  }
}


