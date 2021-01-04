import { Injectable } from '@angular/core';
import { ApiService } from '../server/api.service';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { AppService } from '../app/app.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  playerid: any = '12345678';
  notificationData: any;

  constructor(public oneSignal: OneSignal, public modalctrl: ModalController, public app: AppService,
    public platform: Platform, public Api: ApiService,
    public loader: LoadingController) { 
  
  }

  OneSignalInit() {
    this.platform.ready().then( () => {
      if (this.platform.is('cordova')) {
        this.oneSignal.startInit('4b8c575f-7307-40ea-b4f0-b9eef52c791e', '409717222620'); // import APP ID and Project Number
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.setSubscription(true);
        this.oneSignal.getIds().then((deviceid) => {
          this.playerid = deviceid.userId;
          this.app.state.set('playerid', deviceid.userId);
          this.app.updateOneSignalId(deviceid.userId);
        });
  
        this.oneSignal.handleNotificationReceived().subscribe((res: any) => {
          console.log('handleNotificationReceived',res);
  
        });
  
        this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
          console.log('handleNotificationOpened',data);
        });
  
        this.oneSignal.endInit();
      }
    });
  }


  sendNotificationwithData(data) {


  }

}
