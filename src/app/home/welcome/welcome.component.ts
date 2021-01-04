import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AppService } from '../../../jApp/app/app.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';
import { NavigatorService } from '../../../jApp/navigator.service';
import { environment } from '../../../environments/environment';
import { StackerService } from '../../../jApp/app/stacker.service';
import { WishlistService } from '../../../jApp/app/wishlist.service';
import { Location } from '@angular/common';
import { UtilityService } from '../../../jIonic/utility.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    //  autoplay: {
    //   disableOnInteraction: false
    // },
    //loop: true,
    slidesPerView: 1
  };

  slideOptsProduct = {
    initialSlide: 0,
    speed: 400,
    //  autoplay: {
    //   disableOnInteraction: false
    // },
    //loop: true,
    slidesPerView: 1
  };

  categoryOpts = {
    initialSlide: 0,
    speed: 400,
    // autoplay: {
    //   disableOnInteraction: false
    // },
    //loop: true,
    slidesPerView: 3
  };
  pinValue = '';

  productOpts = {
    initialSlide: 0,
    speed: 400,
    //autoplay: true,
    //loop: true,
    slidesPerView: 2
  };

  today = new Date();
  //activity = 'Right time for planting tomatoes';

  slidesList = [];

  products: Array<any> = [];
  productsBanner: Array<any> = [];
  fadeBanner: Array<any> = [];
  mainBanner: Array<any> = [];
  productsHome: Array<any> = [];
  productStore: Array<any> = [];

  fetchingProducts: boolean = true;
  fetchingHomeProducts: boolean = true;
  current_page: number = 1;
  last_page: number = 999;

  productStack: any;

  categories = [];
  homeCategories = [];
  searchProductsList = [];
  categorySlug = '';  
  searchText = 'try';
  dealEnabled = false;
  categoriesMenu = [];
  initialLoad = true;
  bannerMainShow = 'show';
  bannerDealShow = 'show';
  initInterval: any;
  ionViewInterval: any;

  @ViewChild('searchProduct', {static: false}) searchProduct;


  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.slug === o2.slug : o1 === o2;
  }

  compareWith = this.compareWithFn;

  constructor(public navCtrl: NavController, public app: AppService, public restApi: RestApiService,
     public navigator: NavigatorService, public platform: Platform,
     public wishlist: WishlistService, public stacker: StackerService,
     private location: Location,
     public utility: UtilityService,
     private homeService: HomeService
     ) { 
    this.platform.ready().then(()=> {
      //this.fetchSpotlightBanners();
    });
  }

  ngOnInit() {
    console.log('on init');
    if (this.app.state.currPinCode) {
      this.initialLoad = false;
    }
    this.homeService.categoriesSubject.subscribe((subData: any) => {
      if(subData) {     
        this.pinValue = this.app.state.currPinCode;
        const mainCat = subData.mainCat;
        this.categoriesMenu = subData.categoriesMenu;        
        this.homeCategories = subData.allCategories.filter((item) => (item.term_id !== mainCat[0].term_id && item.parent === 0));
        this.homeCategories.sort(this.compare);
        let categories = {categories:[], productType: 'deals', vendor_id: this.app.state.get('user').id};
        //this.homeCategories.forEach((element, index) => {
        categories.categories = this.homeCategories; 
        // });
        this.app.api.getProductsByCats(categories).subscribe(res => {
          if (res &&  res.status && res.status === 'success') {
            if (res.data.products) {
              this.homeCategories.forEach((element, index) => {
                this.homeCategories[index].productsHome = res.data.products.categories[index].data;
              });
              //setTimeout(() => {
                //this.initialLoad = false;
              //}, 180000);
              this.productsBanner = res.data.products.productType.data;
              this.fadeBanner[0] = this.productsBanner[0];
              this.fadeBanner[1] = this.productsBanner[0];
              if (this.productsBanner.length > 1) {
                let currIndex = 0;
                let displayed = 0;
                this.initInterval = setInterval(() => {
                  if (currIndex < this.productsBanner.length) {
                    if (this.bannerDealShow === 'show' && displayed > 2) {
                      this.bannerDealShow = 'hide';
                      currIndex++;
                      displayed = 0;
                    } else {
                      if (currIndex === this.productsBanner.length-1) {
                        this.fadeBanner[1] = this.productsBanner[0];
                      } else {
                        this.fadeBanner[1] = this.productsBanner[currIndex+1];
                      }
                      this.fadeBanner[0] = this.productsBanner[currIndex];
                      this.bannerDealShow = 'show';
                      displayed++;
                    }                      
                  } else {
                    this.bannerDealShow = 'show';
                    currIndex = 0;
                    this.fadeBanner[1] = this.productsBanner[currIndex+1];
                    this.fadeBanner[0] = this.productsBanner[currIndex];
                    displayed++;
                  }
                }, 1000);
                //this.slideOptsProduct.loop = false;  //true
              } else {
               // this.slideOptsProduct.loop = false;
              }        
            }
          }
          this.initialLoad = false;      
        });
      }
    }, error => {
      this.initialLoad = false;
    })
  }

  ionViewWillEnter() {   
    this.reload();
    this.pinValue = this.app.state.currPinCode;
    console.log('ion view ', this.initialLoad);
    if (this.app.state.categories && !this.initialLoad) { 
      if (this.initInterval) {
        clearInterval(this.initInterval);
      }
      if (this.ionViewInterval) {
        clearInterval(this.ionViewInterval);
      }
      this.initialLoad = true;
      const mainCat = this.app.state.categories.filter((item) => item.slug === 'main-categories');
      if (mainCat) {
        this.categoriesMenu = this.app.state.categories.filter((item) => item.parent == mainCat[0].term_id);
        this.categoriesMenu.sort(this.compare);
      }
      this.homeCategories = this.app.state.categories.filter((item) => (item.term_id !== mainCat[0].term_id && item.parent === 0));
      this.homeCategories.sort(this.compare);
      let categories = {categories:[], productType: 'deals', vendor_id: this.app.state.get('user').id};
      categories.categories = this.homeCategories; 
      this.app.api.getProductsByCats(categories).subscribe(res => {
        if (res &&  res.status && res.status === 'success') {
          if (res.data.products) {
            this.homeCategories.forEach((element, index) => {
              this.homeCategories[index].productsHome = res.data.products.categories[index].data;
            });            
            setTimeout(() => {
              this.initialLoad = false;
            }, 18000);
            this.productsBanner = res.data.products.productType.data;
            this.fadeBanner[0] = this.productsBanner[0];
            this.fadeBanner[1] = this.productsBanner[0];
            if (this.productsBanner.length > 1) {
              let currIndex = 0;
              let displayed = 0;
              this.ionViewInterval = setInterval(() => {
                if (currIndex < this.productsBanner.length) {
                  if (this.bannerDealShow === 'show' && displayed > 2) {
                    this.bannerDealShow = 'hide';
                    currIndex++;
                    displayed = 0;
                  } else {
                    if (currIndex === this.productsBanner.length-1) {
                      this.fadeBanner[1] = this.productsBanner[0];
                    } else {
                      this.fadeBanner[1] = this.productsBanner[currIndex+1];
                    }
                    this.fadeBanner[0] = this.productsBanner[currIndex];
                    this.bannerDealShow = 'show';
                    displayed++;
                  }                      
                } else {
                  this.bannerDealShow = 'show';
                  currIndex = 0;
                  this.fadeBanner[1] = this.productsBanner[currIndex+1];
                  this.fadeBanner[0] = this.productsBanner[currIndex];
                  displayed++;
                }
              }, 1000);
              //this.slideOptsProduct.loop = false;  //true
            } else {
              //this.slideOptsProduct.loop = false;
            }        
            console.log('fadeBanner.length', this.fadeBanner.length);    
          }
        }
      });
    }
  }

  compare(b, a) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }

  reload() {
    if(this.products && this.products != null && this.products.length > 0)
    {
      this.productStore = this.products;
    }

    setTimeout(() => {
      this.products = this.productStore;
    }, 100);
   
  }

  loadMore() {
    this.current_page++;
  }

  productDetail(product) {
    this.navigator.navigationData = {product};
    this.navCtrl.navigateForward('home/productdetail');
  }

  productPrice(x) {
      if(x.sale_price == '') return  x.price;
      return x.price;
  }

  getCatBg(cats) {
    return environment.domain + cats.category_img_url;
  }

  gotoCat(cat){
    this.navigator.navigationData = cat;
    this.navCtrl.navigateForward('home/categoryWise');
  }

  // fetchSpotlightBanners() {
  //   this.app.api.getSpotlightBanners().subscribe(res => {
  //     this.fetchingProducts = false;
  //     if (res &&  res.status && res.status === 'success') {
  //       this.slidesList = res.data.banners;
  //       this.mainBanner[0] = this.slidesList[0];
  //       this.mainBanner[1] = this.slidesList[0];
  //       //this.slideOpts.speed = 400;
  //       let currIndex = 0;
  //       let displayed = 0;
  //       setInterval(() => {
  //         if (currIndex < this.slidesList.length) {
  //           if (this.bannerMainShow === 'show' && displayed > 2) {
  //             this.bannerMainShow = 'hide';
  //             currIndex++;
  //             displayed = 0;
  //           } else {
  //             if (currIndex === this.slidesList.length-1) {
  //               this.mainBanner[1] = this.slidesList[0];
  //             } else {
  //               this.mainBanner[1] = this.slidesList[currIndex+1];
  //             }     
  //             this.mainBanner[0] = this.slidesList[currIndex];   
  //             this.bannerMainShow = 'show';
  //             displayed++;
  //           }                      
  //         } else {
  //           this.bannerMainShow = 'show';
  //           currIndex = 0;
  //           this.mainBanner[1] = this.slidesList[currIndex+1];
  //           this.mainBanner[0] = this.slidesList[currIndex];
  //           displayed++;
  //         }
  //       }, 1000);
  //     }
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  selectCategory(event) {    
    this.searchProductsList=[];
    this.searchProduct.value = '';
    this.categorySlug = '';     
    this.categorySlug = event.detail.value;
  }

  onSearchChange(event) {
    this.searchProductsList = [];
    if (event.detail.value && event.detail.value.length > 2) {
      const searchObj: any = {srProd: event.detail.value};
      if (this.categorySlug && this.categorySlug !== 'all') {
        searchObj.category = {
          term_id : this.categorySlug
        };
      }  
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

  productBanner(product) {
    if (product.extras) {
      const relImageProduct = product.extras.find(item => item.key_name === '_product_related_images_url');
      if (relImageProduct) {
        const relImages = JSON.parse(relImageProduct.key_value);
        if (relImages.shop_banner_image) {
          return relImages.shop_banner_image;
        } else {
          return product.image_url;
        }
      } else {
        return product.image_url;
      }
    }
  }

  doRefresh(event) {
    location.reload();
  }

  checkIfNumber(e) {
    const matchArr = e.key.match(/[0-9]*/);
    if (matchArr[0] || e.key === 'Backspace' || e.key === 'Delete') {
      //if ()
      return true;
    } else {
      return false;
    }
  }

  checkPincode(e) {
    const pinVal = e.srcElement.value;
    if (pinVal.length > 5) {
      this.pinValue = pinVal;
      this.app.state.currPinCode = pinVal;
      this.app.getPincodeProducts({pincode: pinVal}).subscribe(res => {
        if(res && res.status && res.status == 'success' && res.data.products.length > 0) {
          this.utility.toast('Products are available in this pincode');
        } else {
          this.utility.toast('Sorry products are not currently available in this pincode');
        }
      },(error) => {
        this.utility.toast('Error in connection. Try again!!');
      });
    }
  }
}
