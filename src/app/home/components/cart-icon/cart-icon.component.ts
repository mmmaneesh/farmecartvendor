import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from '../../../../jApp/app/cart.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss'],
})
export class CartIconComponent implements OnInit {

  constructor(public navCtrl: NavController, public cart: CartService) { }

  ngOnInit() {}

  
  gotoCart() {
    this.navCtrl.navigateForward('home/shoppingcart')
  }

}
