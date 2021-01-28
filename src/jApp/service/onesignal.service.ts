import { Injectable } from '@angular/core';
import { ApiService } from '../server/api.service';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { AppService } from '../app/app.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { UtilityService } from '../../jIonic/utility.service';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  playerid: any = '12345678';
  notificationData: any;

  constructor(public oneSignal: OneSignal, public modalctrl: ModalController, public app: AppService,
    public platform: Platform, public Api: ApiService, public utility: UtilityService,
    public loader: LoadingController) { 
  
  }

  OneSignalInit() {
    this.platform.ready().then( () => {
      if (this.platform.is('cordova')) {

        // this.oneSignal.startInit('e3fbb154-a2ee-4e3c-9372-611805246f22', '360978708868');

        // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

        // this.oneSignal.handleNotificationReceived().subscribe(() => {
        // // do something when notification is received
        //   this.utility.toast('handleNotificationReceived');
        // });

        // this.oneSignal.handleNotificationOpened().subscribe(() => {
        //   // do something when a notification is opened
        //   this.utility.toast('handleNotificationOpened');
        // });

        // this.oneSignal.endInit();
        this.utility.toast('one signal in ');
        this.oneSignal.startInit('e3fbb154-a2ee-4e3c-9372-611805246f22', '360978708868'); // import APP ID and Project Number
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.setSubscription(true);
        this.oneSignal.getIds().then((deviceid) => {
          this.playerid = deviceid.userId;
          this.app.state.set('playerid', deviceid.userId);
          this.app.updateOneSignalId(deviceid.userId);
          this.utility.toast('one signal dev ' + deviceid.userId);
        });
  
        this.oneSignal.handleNotificationReceived().subscribe((res: any) => {
          console.log('handleNotificationReceived',res);
          this.utility.toast('handleNotificationReceived ' + res);
        });
  
        this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
          console.log('handleNotificationOpened',data);
          this.utility.toast('handleNotificationOpened ' + data);
        });
  
        this.oneSignal.endInit();
      }
    });
  }


  sendNotificationwithData(data) {


  }

}
