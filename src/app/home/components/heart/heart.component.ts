import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../../../jApp/app/app.service';
import { WishlistService } from '../../../../jApp/app/wishlist.service';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss'],
})
export class HeartComponent implements OnInit {

  @Input() product: any;
  @Input() size: any;

  filled: boolean = false;

  constructor(public app: AppService, public wishlist: WishlistService) { }

  ngOnInit() {
    this.checkisfill();
  }

  checkisfill() {
    if(this.app.state.wishlist != null) {
      for(let x of this.app.state.wishlist) {
        if(x.id == this.product.id) 
        {
          this.filled = true;
          return;
        }
      }
    } 

    this.filled = false;
  }

  unfill() {
      this.wishlist.removeProduct(this.product);
      this.checkisfill();
  }


  fill() {
    this.wishlist.addProduct(this.product);
    this.checkisfill();
  }


}
