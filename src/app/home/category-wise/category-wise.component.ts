import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../jApp/app/app.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';
import { NavigatorService } from '../../../jApp/navigator.service';

@Component({
  selector: 'app-category-wise',
  templateUrl: './category-wise.component.html',
  styleUrls: ['./category-wise.component.scss'],
})
export class CategoryWiseComponent implements OnInit {

  products: Array<any>;
  cat: any;
  fetchingProducts: boolean = true;
  current_page: number = 1;
  last_page: number = 999;
  deliveryDate = new Date();
  productsAvailableToPincode = [];

  constructor(public navCtrl: NavController, public app: AppService, public restApi: RestApiService, public navigator: NavigatorService) { }

  ngOnInit() {
    // const day = this.deliveryDate.getDay();
    // const time = this.deliveryDate.getHours();
    // if (day === 0 || time >= 15) {
    //   this.deliveryDate.setDate( this.deliveryDate.getDate() + 3 );
    // } else {
    //   if (day === 6 && time >= 15) {
    //     this.deliveryDate.setDate( this.deliveryDate.getDate() + 4 );
    //   } else {
    //     this.deliveryDate.setDate( this.deliveryDate.getDate() + 2 );
    //   }
    // }
    this.cat = Object.assign({}, this.navigator.navigationData);
    if(typeof this.cat.name == 'undefined') {
      this.navCtrl.navigateBack('/home');
    }    
    console.log(this.app.state.currPinCode);
    this.app.getPincodeProducts({pincode: this.app.state.currPinCode}).subscribe(res => {
      if(res && res.status && res.status == 'success' && res.data.products.length > 0) {
        this.productsAvailableToPincode = res.data.products;
      }
      this.fetchProducts();
    },(error) => {
      console.log(error);
      this.fetchProducts();
    });  
  }

  fetchProducts(more: boolean = false) {
    this.app.api.getProductsByCats({category: this.cat, page: this.current_page, vendor_id: this.app.state.get('user').id}).subscribe(res => {
      this.fetchingProducts = false;
      if(res &&  res.status && res.status == 'success') {
        this.current_page = res.data.products.current_page;
        this.last_page = res.data.products.last_page;
        if(more === false) {
          this.products = res.data.products.data;
        } else {
          this.products = this.products.concat(res.data.products.data);
        }
        this.products.map((product) => {
          product.deliverable = this.checkDeliverable(product);
        });

        if(this.current_page < this.last_page) {
          this.loadMore();
        }
        
      }
    }, error => {
      this.fetchingProducts = false;
    });
  }

  checkDeliverable (product) {    
    if(this.productsAvailableToPincode.length > 0) {
      const productAvailable = this.productsAvailableToPincode.find(item => item.product_id === product.id);
      if (productAvailable && productAvailable.product_id) {
        product.deliveryDate = new Date();
        const day = product.deliveryDate.getDay();
        const time = product.deliveryDate.getHours();
        if (day === 0 || time >= 15) {
          if (day === 4) {
            product.deliveryDate.setDate( product.deliveryDate.getDate() + 4 );
          }
          product.deliveryDate.setDate( product.deliveryDate.getDate() + 3 );
        } else {
          if (day === 6 && time >= 15) {
            product.deliveryDate.setDate( product.deliveryDate.getDate() + 4 );
          } else {
            if (day === 5 && time < 15) {
              product.deliveryDate.setDate( product.deliveryDate.getDate() + 3 );
            } else {
              product.deliveryDate.setDate( product.deliveryDate.getDate() + 2 );
            }
          }
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  
  loadMore() {
    this.current_page++;
    this.fetchProducts(true);
  }

  productDetail(product) {
    this.navigator.navigationData = { product, catProducts: this.products};
    this.navCtrl.navigateForward('home/productdetail')
  }

  productPrice(x) {
      if(x.sale_price == '') return  x.price;
      return x.price;
  }

  segmentChanged(e) {
    let products = document.getElementById('products');
    let categories = document.getElementById('categories');

    if(e.detail.value == 'products') {
      products.style.display = 'block';
      categories.style.display = 'none';
    } else if(e.detail.value == 'categories') {
      products.style.display = 'none';
      categories.style.display = 'block';
    }
  }
}
