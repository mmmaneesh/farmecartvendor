import { Component, OnInit } from '@angular/core';
import { AppService } from '../../jApp/app/app.service';
import { OneSignalService } from '../../jApp/service/onesignal.service';
import { NavController, Platform } from '@ionic/angular';
import { NavigatorService } from '../../jApp/navigator.service';
import { RestApiService } from '../../jApp/server/rest-api.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { UtilityService } from '../../jIonic/utility.service';
import { HomeService } from './home.service';
import { CourierService } from '../../jApp/service/courier.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SpeechRecognition]
})
export class HomeComponent implements OnInit {

  categoriesMenu = [];
  searchProductsList = [];
  searchCapturedList = [];

  constructor(public app: AppService, public oneSignal: OneSignalService, public restApi: RestApiService,
              public navCtrl: NavController, public platform: Platform, public navigator: NavigatorService,
              public speechRecognition: SpeechRecognition,
              public utility: UtilityService,
              private homeService: HomeService,
              private courierService: CourierService) { }

              
              
  speechCheck() {          
            
      // Check feature available
      // this.speechRecognition.isRecognitionAvailable()
      //   .then((available: boolean) => console.log(available))
      
      // Start the recognition process
      //this.speechRecognition.startListening(options)
      // let options ={
      //   language:'en-US'
      // }
      this.speechRecognition.startListening()
        .subscribe(
          (matches: any) => {
            this.searchCapturedList = matches;
            this.navCtrl.navigateForward('home/categories');
          },
          (onerror) => {
            //this.utility.toast('error: '+ onerror);
          }
        )
      
      // Stop the recognition process (iOS only)
      //this.speechRecognition.stopListening()
      
      // Get the list of supported languages
      // this.speechRecognition.getSupportedLanguages()
      //   .then(
      //     (languages: string[]) => console.log(languages),
      //     (error) => console.log(error)
      //   )     
      
  }         

  ngOnInit() {
    // this.courierService.getCourierToken().subscribe((response) => {
    //   console.log('courier response => ', response);
    // });
    // Check permission
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      console.log(hasPermission)
      if (!hasPermission) {
        this.speechRecognition.requestPermission()
        .then(
          () => console.log('Granted'),
          () => console.log('Denied')
        )
      }
    })
  
  // Request permissions
  
    this.platform.ready().then(() => {
      this.oneSignal.OneSignalInit();
      this.app.loadLastState();
      this.app.startSyncer();
      //this.app.getCategories();
      //this.app.getPincodes();
      //this.app.getSlotes();

      this.app.state.fetchingProducts =true;
      this.app.getCategoriesRaw().subscribe(res => {
        this.app.state.fetchingProducts = false;
        if(res &&  res.status && res.status == 'success') {
          this.app.state.set('categories', res.data.cats);
          const pinValue = this.app.state.detail ? this.app.state.detail.billing_address.zipcode : '';
          this.app.state.set('currPinCode', pinValue);
          const mainCat = res.data.cats.filter((item) => item.slug === 'main-categories');
          if (mainCat) {
            this.categoriesMenu = res.data.cats.filter((item) => item.parent == mainCat[0].term_id);
            this.categoriesMenu.sort(this.compare);
          }          
          this.homeService.categoriesSubject.next({mainCat: mainCat, categoriesMenu: this.categoriesMenu, allCategories: res.data.cats});
        }
      }, error => {
        this.app.state.fetchingProducts = false;
      })
    });
  }

  compare(b, a) {
    if (a.name < b.name) {
      return -1;
    // a should come after b in the sorted order
    } else if (a.name > b.name) {
          return 1;
    // and and b are the same
    } else {
          return 0;
    }
  }

  onSpeechWordClick(speechWord) {
    this.searchProductsList = [];
    this.searchCapturedList = [];
    if (speechWord) {
      const searchObj: any = {srProd: speechWord};
      this.app.api.getProductsByCats(searchObj).subscribe(res => {
        if (res &&  res.status && res.status === 'success') {
          //this.searchProductsList = res.data.products.data;
          const prodctsData = res.data.products.data;
          this.searchProductsList[0] = prodctsData[0];
          prodctsData.forEach(element => {
            if (this.searchProductsList.find(item => item.title !== element.title) && this.searchProductsList.find(item => item.categories !== element.categories)) {
              this.searchProductsList.push(element);
            }
          });
        }
      });    
    }
  }

  gotoCat(cat = '') {
    this.searchProductsList=[];
    this.navCtrl.navigateForward('home');
    setTimeout(() => {
      if (cat) {
        this.navigator.navigationData = cat;
        this.navCtrl.navigateForward('home/categoryWise');
      } else {
        this.navCtrl.navigateForward('home/categories');
      }
    }, 100);
  }
  logout() {
    const res = confirm('Do you want to logout');
    if (res === true)   {
      this.app.logout();
    }
  }

}
