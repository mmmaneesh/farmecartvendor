import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigatorService } from '../../../jApp/navigator.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';
import { CartService } from '../../../jApp/app/cart.service';
import { UtilityService } from '../../../jIonic/utility.service';
import { Save4laterService } from '../../save4later.service';
import { AppService } from '../../../jApp/app/app.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.page.html',
  styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit {

  qty: number = 1;
  product: any = {};
  productBg: any = "assets/icon/no-image.png";
  showProdDesc = true;
  updateBtn = false;
  images: any = [
    "assets/icon/no-image.png"
  ]

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay:true
  };
  productsAvailableToPincode = [];

  
  scrollElement;
  divOffsetTop;
  manufacturer = {};
  @ViewChild('theScrollEl', {static: false}) theScrollEl: any;

  constructor(public navCtrl: NavController, public navigator: NavigatorService, public restApi: RestApiService,
     public cart: CartService, public utility: UtilityService, 
     public save4later: Save4laterService, private app: AppService,
      private router: Router, public sanitization:DomSanitizer) { }

  ngOnInit() {
    if (this.navigator.navigationData && this.navigator.navigationData.product) {
      this.product = Object.assign({}, this.navigator.navigationData.product);
      this.qty = this.product.stock_qty;      
    }

    if(typeof this.product.type == 'undefined') {
      this.navCtrl.navigateBack('/home');
    }

    this.resolveImages();
  }

  resolveImages() {
    this.images = [];

    let photoUrl = this.restApi.domain + this.product.image_url;

    let extras = this.product.extras;
    let key_value = null;
    let product_gallery_images = [];

    let images = [photoUrl];
    for(let etc of extras) {
      if(etc.key_name == '_product_related_images_url') 
      {
        key_value = etc.key_value;
      }
    }

    if(key_value != null) {
      product_gallery_images = JSON.parse(key_value).product_gallery_images;
    }

    for(let img of product_gallery_images) {
      images.push(this.restApi.domain + img.url);
    }

    this.images = images;
  }

  productDetail(product) {
    // this.navigator.navigationData = {product, catProducts: this.relatedProducts};
    // this.navCtrl.navigateRoot('home/productdetail/'+ product.id);
    this.product = product;
    this.images = [];
    this.qty = this.product.stock_qty;
    setTimeout(() => {
      this.resolveImages();
      let sElement = this.theScrollEl.getScrollElement().then(sroller => {
        console.log(sroller.scrollTo(0,0));
      });

    },100);

  }

  incQty() {
    this.updateBtn = true;
    this.qty = Number(this.qty);
    this.qty += 1;
  }

  decQty() {
    this.updateBtn = true;
    this.qty = Number(this.qty);
    if(this.qty >= 1) this.qty -= 1;
  }

  updateStockQty() {
    console.log('qty ', this.qty);
    this.app.api.updateStockQty({productId: this.product.id, qty: this.qty}).subscribe(res => {
      if(res && res.status == 'success') {
        this.utility.toast(res.message);
        this.navCtrl.navigateBack('/home');
      } 
    });
  }

  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
}
