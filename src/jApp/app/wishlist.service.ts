import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  products: Array<any> = [];

  constructor(private app: AppService, public platform: Platform) { 
    this.platform.ready().then(()=> {
      let products = this.app.state.get('wishlist');
      if(products == null) products = [];
      this.products = products;
    });
  }

  isProductAlreadyInWishlist(id) {
    if(this.products != null) {
      for(let x of this.products)
      {
          if(x.id == id) {
            return x;
          }
      }
      return false;
    } else {
      return false;
    }
    
  }

  addProduct(product) {
    let isPro = this.isProductAlreadyInWishlist(product.id);
    if(isPro === false) {
      this.products.push(product);
    }

    this.app.state.set('wishlist', this.products);
  }

  removeProduct(product) {
    for(let x of this.products)
    {
      if(x.id == product.id) {
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
    this.app.state.set('wishlist', this.products);
  }

  clearAll() {
    this.products = [];
  }
}
