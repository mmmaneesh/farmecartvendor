import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  constructor(public router: Router, public navCrtl: NavController) {

  }


  navigationData: any;
  processName: any;

  goto(pageName, navigationData: any = {}) {
    this.navigationData = navigationData;
    this.router.navigateByUrl(pageName);
  }

  logout() {
    this.navCrtl.navigateRoot('/');
  }
  
}
