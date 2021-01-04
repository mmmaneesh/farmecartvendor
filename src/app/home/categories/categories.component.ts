import { Component, OnInit, ɵConsole } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../jApp/app/app.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';
import { NavigatorService } from '../../../jApp/navigator.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  products: Array<any>;
  categoriesMenu = [];
  fetchingCategories = true;
  cat: any
  parentId = 0;

  constructor(public navCtrl: NavController, public app: AppService, public restApi: RestApiService, public navigator: NavigatorService) { }

  ngOnInit() {
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

  ionViewWillEnter() {
    this.fetchingCategories = true;
    const mainCat = this.app.state.categories.filter((item) => item.slug === 'main-categories');
    if (mainCat) {
      this.categoriesMenu = this.app.state.categories.filter((item) => item.parent == mainCat[0].term_id);
      this.categoriesMenu.sort(this.compare);
    }
  }

  gotoCat(cat) {
    //this.cat = cat;
    //this.parentId = cat.parent;
    this.categoriesMenu = this.app.state.categories.filter((item) => item.parent == cat.term_id);
    if (this.categoriesMenu.length > 0) {
      this.categoriesMenu.sort(this.compare); 
    } else {      
      setTimeout(() => {
          this.navigator.navigationData = cat;
          this.navCtrl.navigateForward('home/categoryWise');
      }, 100);
    }
  }

  
}
