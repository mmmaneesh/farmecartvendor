import { Injectable } from '@angular/core';
import { AppService } from '../jApp/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class Save4laterService {

  
  products: Array<any> = [];

  constructor(private app: AppService) { 
    let products = this.app.state.get('save4later');
    if(products == null) products = [];
    this.products = products;
  }

  isProductAlready(id) {
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
    let isPro = this.isProductAlready(product.id);
    if(isPro === false) {
      this.products.push(product);
      this.app.state.set('save4later', this.products);
      return true;
    }

    return false;
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
    this.app.state.set('save4later', this.products);
  }

  clearAll() {
    this.products = [];
  }
}
