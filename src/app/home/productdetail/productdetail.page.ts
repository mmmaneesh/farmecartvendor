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
  relatedProducts: Array<any> = [];
  fetchingProducts: boolean = false;
  productBg: any = "assets/icon/no-image.png";
  showProdDesc = true;
  deliveryDate = new Date();
  deliverable = false;

  images: any = [
    "assets/icon/no-image.png"
  ]

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay:true
  };
  deliveryCharge = '';
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
      if (this.product.weight) {
        if (this.product.courier === 1) {
          const deliveryChargeArr = this.app.state.deliveryCharges.find(item => (parseInt(this.product.weight) >= item.min && parseInt(this.product.weight) <= item.max));
          this.deliveryCharge = deliveryChargeArr['amount'];
        } else {
          const deliveryChargeArr = this.app.state.deliveryFarmECartCharges[0];
          this.deliveryCharge = deliveryChargeArr['amount'];
        }
      }
      this.qty = this.product.display_qty;
      if(typeof this.navigator.navigationData.catProducts != 'undefined') {
        //this.relatedProducts = this.navigator.navigationData.catProducts;
        const relatedProductsArr = this.navigator.navigationData.catProducts.filter(item => item.extras.find(item1 => item1.key_name === '_product_enable_as_related' && item1.key_value === 'yes' ));
        this.relatedProducts = relatedProductsArr.slice(0,4);
      }
      this.app.getPincodeProducts({pincode: this.app.state.currPinCode}).subscribe(res => {
        if(res && res.status && res.status == 'success' && res.data.products.length > 0) {
          this.productsAvailableToPincode = res.data.products;
        }
        this.deliverable = this.checkDeliverable(this.product);
      },(error) => {
        console.log(error);
        this.deliverable = this.checkDeliverable(this.product);
      });       
    }

    if(typeof this.product.type == 'undefined') {
      this.navCtrl.navigateBack('/home');
    }

    if(this.product.categories && this.product.categories.length > 0) {
      this.manufacturer = this.product.categories.find(item => item.type === 'product_brands');
      this.fetchProducts(this.product.categories[0]);
    }

    this.resolveImages();
  }


  checkDeliverable (product) {    
    if(this.productsAvailableToPincode.length > 0) {
      const productAvailable = this.productsAvailableToPincode.find(item => item.product_id === product.id);
      if (productAvailable && productAvailable.product_id) {
        const day = this.deliveryDate.getDay();
        const time = this.deliveryDate.getHours();
        if (day === 0 || time >= 15) {
          if (day === 4) {
            this.deliveryDate.setDate( this.deliveryDate.getDate() + 4 );
          }
          this.deliveryDate.setDate( this.deliveryDate.getDate() + 3 );
        } else {
          if (day === 6 && time >= 15) {
            this.deliveryDate.setDate( this.deliveryDate.getDate() + 4 );
          } else {
            if (day === 5 && time < 15) {
              this.deliveryDate.setDate( this.deliveryDate.getDate() + 3 );
            } else {
              this.deliveryDate.setDate( this.deliveryDate.getDate() + 2 );
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

  // checkDeliverable () {
  //   const pinCodeDetail = this.app.state.pincodes.find(item => item.value === this.app.state.currPinCode);
  //     if (pinCodeDetail) {
  //       const currPinGrp = pinCodeDetail.pin_group.split(',');
  //       const prdctPinGrp = this.product.pin_group.split(',');
  //       if (currPinGrp.find(item => prdctPinGrp.includes(item))) {
  //         const day = this.deliveryDate.getDay();
  //         const time = this.deliveryDate.getHours();
  //         if (day === 0 || time >= 15) {
  //           if (day === 4) {
  //             this.deliveryDate.setDate( this.deliveryDate.getDate() + 4 );
  //           }
  //           this.deliveryDate.setDate( this.deliveryDate.getDate() + 3 );
  //         } else {
  //           if (day === 6 && time >= 15) {
  //             this.deliveryDate.setDate( this.deliveryDate.getDate() + 4 );
  //           } else {
  //             if (day === 5 && time < 15) {
  //               this.deliveryDate.setDate( this.deliveryDate.getDate() + 3 );
  //             } else {
  //               this.deliveryDate.setDate( this.deliveryDate.getDate() + 2 );
  //             }
  //           }
  //         }         
  //         return true;
  //       }
  //     }
  //     return false;
  // }


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
    this.deliverable = this.checkDeliverable(this.product);
    this.images = [];
    this.qty = this.product.display_qty;
    setTimeout(() => {
      this.resolveImages();
      let sElement = this.theScrollEl.getScrollElement().then(sroller => {
        console.log(sroller.scrollTo(0,0));
      });

    },100);

  }

  gotoReviews(product) {
    this.navigator.navigationData = product;
    this.navCtrl.navigateForward('home/reviews/'+ this.product.id);
  }

  fetchProducts(cat) {
    this.app.api.getProductsByCats({category: cat, page: 1}).subscribe(res => {
      this.fetchingProducts = false;
      if(res &&  res.status && res.status == 'success') {
        const relatedProductsArr = res.data.products.data.filter(item => item.extras.find(item1 => item1.key_name === '_product_enable_as_related' && item1.key_value === 'yes' ));
        this.relatedProducts = relatedProductsArr.slice(0,4);
      }
    }, error => {
      this.fetchingProducts = false;
    });
  }

  incQty() {
    this.qty += 1;
    this.qty = Number(this.qty);
  }

  decQty() {
    if(this.qty > 1) this.qty -= 1;
    this.qty = Number(this.qty);
  }

  escape_html(str) {
  
    if (typeof str == 'undefined' || (str===null) || (str==='') )
          return false;
    else
      str = str.toString();
      str =  str.replace(/&amp;/g ,'&');
      str =  str.replace(/&lt;/g ,'<');
      str =  str.replace(/&gt;/g ,'>');
      return str;
  }

  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  stripHtml(str)
  {
    let newstr = this.escape_html(str);
    if(newstr === false) return '';
    return newstr.replace(/(<([^>]+)>)/ig,"");
  }


  gotoCart() {
    this.navCtrl.navigateForward('home/shippingcart');
  }

  addToCart() {
    if (this.isInStock(this.product) && this.deliverable) {
      this.cart.addProduct(this.product, this.qty);
      this.utility.toast('Product Added');
    } else {
      if (!this.isInStock(this.product)) {
        this.utility.toast('Out of stock');
      } else {
        this.utility.toast('Not deliverable to your pincode');
      }
    }
    
  }

  addToCheckout() {
    if (this.isInStock(this.product) && this.deliverable) {
      this.cart.addProduct(this.product, this.qty);
    }
    this.navCtrl.navigateForward('home/checkout-first');  
  }

  productPrice(x) {
    if(x.sale_price == '') {
      return  (x.price * this.qty).toFixed(2);
    }
    return (x.sale_price * this.qty).toFixed(2);
  }

  convertToFixed(x) {
    return x.toFixed(2);
  }

  relatedproductPrice(x) {
    if(x.sale_price == '') {
      return  x.price;
    }
    return x.sale_price;
  }

  isInStock(x) {
    if(x.stock_availability == 'in_stock' && x.stock_qty > 0) {
      return true;
    } 
    return false;
  }
}
