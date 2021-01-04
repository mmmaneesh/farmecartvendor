import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../jApp/app/app.service';
import { NavigatorService } from '../../../jApp/navigator.service';
import { NavController } from '@ionic/angular';
import { UtilityService } from '../../../jIonic/utility.service';
import { RestApiService } from '../../../jApp/server/rest-api.service';

import * as moment from 'moment';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  product: any;
  selected_rating_value: number = 1;
  product_review_content: string = '';
  isEdit = false;


  reviews: Array<any>;
  fetching: boolean = true;
  current_page: number = 1;
  last_page: number = 999;

  constructor(public app: AppService, public navigator: NavigatorService, public navCtrl: NavController, public utility: UtilityService, public restApi: RestApiService) { }

  ngOnInit() {
    this.product = Object.assign({}, this.navigator.navigationData);
    if(typeof this.product.id == 'undefined') {
      this.navCtrl.navigateBack('/home');
    }

    this.fetchReviews();
  }

  loadMore() {
    this.current_page++;
    this.fetchReviews(true);
  }

  fetchReviews(more: boolean = false) {
    this.fetching = true;
    this.app.api.getComments({page: this.current_page, product_id: this.product.id}).subscribe(res => {
      this.fetching = false;
      if(res &&  res.status && res.status == 'success') {
        this.current_page = res.data.comments.current_page;
        this.last_page = res.data.comments.last_page;
        if(more === false) {
          this.reviews = res.data.comments.data;
        } else {
          this.reviews.concat(res.data.comments.data);
        }
      }
    }, error => {
      this.fetching = false;
    });
  }

  saveComments() {
    let user_id = this.app.state.user.id;
    let product_id = this.product.id;

    if(this.product_review_content == '') {
      return this.utility.toast("Please write few words");
    }

    let data = {user_id, product_id, selected_rating_value: this.selected_rating_value, product_review_content: this.product_review_content};

    this.utility.loader('Please Wait..');
    this.app.api.saveComments(data).subscribe(res => {
      this.utility.loaderDismiss();
      if(res &&  res.status && res.status == 'success') {
          this.reviews = [];
          this.fetchReviews();
          this.product_review_content = ''
          this.utility.toast('Review submit');
      } else {
        this.utility.toast(res.message);
      }
    }, error => {
      this.utility.loaderDismiss();
      this.utility.toast('Something went wrong');
    });
  }

  updateComments() {
    let user_id = this.app.state.user.id;
    let product_id = this.product.id;

    if(this.product_review_content == '') {
      return this.utility.toast("Please write few words");
    }

    let data = {user_id, product_id, selected_rating_value: this.selected_rating_value, product_review_content: this.product_review_content};

    this.utility.loader('Please Wait..');
    this.app.api.updateComments(data).subscribe(res => {
      this.utility.loaderDismiss();
      if(res &&  res.status && res.status == 'success') {
          this.reviews = [];
          this.fetchReviews();
          this.product_review_content = ''
          this.utility.toast('Review submit');
          this.isEdit = false;
      } else {
        this.utility.toast(res.message);
      }
    }, error => {
      this.utility.loaderDismiss();
      this.utility.toast('Something went wrong');
    });
  }

  star(number) {
    this.selected_rating_value = number;
  }

  displayname(x) {
    return x.user.display_name.split(' ', 1);
  }

  humanifyDate(date) {
    return moment(date).format('MMMM Do, h:mm a');
  }

  startEdit(x) {
    this.selected_rating_value = x.rating;
    this.product_review_content = x.content;
    this.isEdit = true;
  }
}
