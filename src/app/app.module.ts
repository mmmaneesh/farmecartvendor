import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { UtilityService } from '../jIonic/utility.service';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { DeviceAccounts } from '@ionic-native/device-accounts/ngx';
import { BgImgDirective } from './bg-img.directive';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { LoaderInterceptor } from './providers/loader-interceptor';
import { JwtInterceptor } from './providers/jwt-interceptor';
import { ErrorInterceptor } from './providers/error-interceptor';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: false
    })
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser, SplashScreen, StatusBar, Camera, DeviceAccounts,FileTransfer, HTTP, OneSignal, UtilityService, SmsRetriever, WebIntent,Stripe, DatePicker, 
    //{provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
