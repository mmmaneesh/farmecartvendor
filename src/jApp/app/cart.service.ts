import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Array<any> = [];
  shipping: Array<any> = [];
  slotDate: any = '';
  slotTime: any = '';

  constructor(private app: AppService, public platform: Platform) { 
    this.app.cart = this;
    this.platform.ready().then(()=> {
      let products = this.app.state.get('cartProducts');
      if(products == null) products = [];
      this.products = products;
    });
  }

  reset() {
    this.products = [];
  }

  isProductAlreadyInCart(id) {
    if(this.products != null) {
      for(let x of this.products)
      {
          if(x.product.id == id) {
            return x;
          }
      }
      return false;
    } else {
      return false;
    }
    
  }

  addProduct(product, qty = 1) {
    let isPro = this.isProductAlreadyInCart(product.id);
    if(isPro !== false) {
      isPro.qty += qty;
      // isPro.qty = Number(isPro.qty).toFixed(2)
      isPro.qty = Number(isPro.qty);
    } else {
      this.products.push({product, qty});
    }

    this.app.state.set('cartProducts', this.products);
  }

  removeProduct(product) {
    for(let x of this.products)
    {
      if(x.product.id == product.product.id) {
        let index = this.products.indexOf(x);
        if (index > -1) {
            this.products.splice(index, 1);
        }

        this.updateState();
        return;
      }
    }

  }

  updateState() {
    this.app.state.set('cartProducts', this.products);
  }

  clearAll() {
    this.products = [];
    this.app.state.set('cartProducts', []);
  }
}
