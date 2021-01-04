import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { NavController } from '@ionic/angular';
import { ApiService } from '../server/api.service';
import { UtilityService } from '../../jIonic/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  cart: any;

  constructor(public state: StateService, private navCtrl: NavController, public api: ApiService, public utility: UtilityService) { 
   
  }

  loadLastState() {
    if(this.isLogin()) {
      this.state.load('user');
      this.state.load('detail');
      this.state.load('products');
      this.state.load('cartProducts');
      this.state.load('wishlist');
      this.state.load('save4later');
      this.state.load('categories');
      this.state.load('pincodes');
    }
  }

  isLogin() {
    let isLogin = this.state.get('isLogin');
    if(isLogin == null || isLogin == false) {
      return false;
    }
    return true;
  }

  static getRootPage() {
    let res = localStorage.getItem('isLogin'); 
    if(res == null) return 'auth';
    if(res == 'true') return 'home';
    return 'auth';
  }

  doLogin(data) {
    this.state.set('isLogin', true);
    this.state.set('user', data.user);
    this.state.set('detail', data.detail);
    this.navCtrl.navigateRoot('home'); 
  }

  logout() {
    this.state.set('isLogin', false);
    this.state.unset('all');
    this.navCtrl.navigateRoot('/auth');
    this.cart.reset();
    this.userSyncer.clearInterval();
  }


  //

  isOnline() {
    let user = this.state.get('user');
    if(user == null) {
      return false;
    } 

    if(user.online_at == null) {
      return false;
    } 

    if(user.online_at == false) 
    {
      return false;
    }

    return true;
  }

  onlineCheckBox:any = {
    component: {},
    ischeck:() => this.isOnline(),
    onChange: (e) => {
        let value = (e) ? 1 : 0;
        this.api.changeOnlineStatus({user_id: this.state.user.id, value: value}).subscribe(res => {
          if(res && res.status && res.status =='success') {
            this.state.user.online_at = e;
            this.state.set('user', this.state.user);

            this.utility.toast(res.message);
          } else {
            this.onlineCheckBox.component.value = !value;
          }
        },
        error => {
          console.log(error);
          this.utility.toast("Something went wrong");
          this.onlineCheckBox.component.value = !value;
        });
    }
  };

  userSyncer: any = null;

  startSyncer() {
    if(this.isLogin()) {
      if(this.userSyncer == null) {
        let sync = () => {
          let user = {id: this.state.user.id};
          this.api.syncUser(user).subscribe((res) => {
            if(res &&  res.status && res.status == 'success') {
              this.state.set('user', res.data.user);
              this.state.set('detail', res.data.detail);
              if (res.data.token) {
                localStorage.setItem('validateUser', res.data.token);
              }
            }
          });
        }
        this.userSyncer = setInterval(() => {
          sync();
        }, 100000);
      }
    }
  }

  updateOneSignalId(deviceid) {
    if(this.isLogin()) {
      let data = {user_id: this.state.user.id, one_signal_id: deviceid};
      this.api.updateOneSignalId(data).subscribe((res) => {
        if(res &&  res.status && res.status == 'success') {
          this.state.user.one_signal_id = deviceid;
          this.state.set('user', this.state.user);
        }
      });
    }
  }

  getProducts(data) {
    this.state.fetchingProducts =true;
    this.api.getProducts(data).subscribe(res => {
      this.state.fetchingProducts = false;
      if(res &&  res.status && res.status == 'success') {
        this.state.products = [];
        let products = this.state.products.concat(res.data.products.data);
        this.state.set('products', products);
      }
    }, error => {
      this.state.fetchingProducts = false;
    })
  }

  getCategories() {
    this.state.fetchingProducts =true;
    this.api.getCategories().subscribe(res => {
      this.state.fetchingProducts = false;
      if(res &&  res.status && res.status == 'success') {
        this.state.set('categories', res.data.cats);
      }
    }, error => {
      this.state.fetchingProducts = false;
    })
  }

  getCategoriesRaw() {
    return this.api.getCategories();
  }

  getPincodes() {
    this.api.getPincodes().subscribe(res => {
      if(res && res.status && res.status == 'success') {
        this.state.set('pincodes', res.data.pincodes);
      }
    });
  }
  
  getPincodeProducts(data) {
    return this.api.getPincodeProducts(data);
  }
}
