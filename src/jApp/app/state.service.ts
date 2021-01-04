import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  user: any = {};
  detail: any = {
      'billing_address' : {
        'firstname' : '',
        'lastname' : '',
        'email' : '',
        'number' : '',
        'country' : '',
        'address' : '',
        'city' : '',
        'zipcode' : ''
    }, 
    'shipping_address' : {
        'firstname' : '',
        'lastname' : '',
        'email' : '',
        'number' : '',
        'country' : '',
        'address' : '',
        'city' : '',
        'zipcode' : ''
    }
  };

  pincodes: Array<any> = [];
  slots: Array<any> = [];

  fetchingProducts: boolean = false;
  products: Array<any> = [];
  categories: Array<any> = [];
  productFetchRecord: any = {};

  cartProducts: Array<any> = [];
  wishlist: Array<any> = [];
  save4later: Array<any> = [];
  currPinCode = '';
  deliveryCharges: Array<any> = [
    {
      'min': 0,
      'max': 150,
      'amount': 45 
    },
    {
      'min': 151,
      'max': 1000,
      'amount': 65 
    },
    {
      'min': 1001,
      'max': 3000,
      'amount': 93 
    },
    {
      'min': 3001,
      'max': 6000,
      'amount': 195 
    },
    {
      'min': 6001,
      'max': 10000,
      'amount': 290 
    }
  ]; 

  deliveryFarmECartCharges: Array<any> = [
    {
      'amount': 50 
    }    
  ];  

  constructor(public dataService: DataService) {

  }

  set(name, data) {
      this[name] = data;
      this.dataService.setLocal(name, data);
  }

  get(name) {
    if(typeof this[name] == 'undefined') {
      this[name] = this.dataService.getLocal(name);
    }
    
    return this[name];
  }

  unset(name) {
    if(name == 'all')
    {
      this.dataService.clearAll();
      this.reset();
    }
  }

  reset() {
    this.user = {};
    this.pincodes = [];

    this.fetchingProducts = false;
    this.productFetchRecord= {};

    this.cartProducts = [];
    this.wishlist = [];
    this.save4later = [];

    this.detail = {
        'billing_address' : {
          'firstname' : '',
          'lastname' : '',
          'email' : '',
          'number' : '',
          'country' : '',
          'address' : '',
          'city' : '',
          'zipcode' : ''
      }, 
      'shipping_address' : {
          'firstname' : '',
          'lastname' : '',
          'email' : '',
          'number' : '',
          'country' : '',
          'address' : '',
          'city' : '',
          'zipcode' : ''
      }
    };
  }


  load(name) {
    this[name] = this.dataService.getLocal(name);
    return this[name];
  }

}
