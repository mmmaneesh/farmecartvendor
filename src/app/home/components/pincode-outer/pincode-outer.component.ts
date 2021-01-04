import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../jApp/app/app.service';
import { UtilityService } from '../../../../jIonic/utility.service';

@Component({
  selector: 'app-pincode-outer',
  templateUrl: './pincode-outer.component.html',
  styleUrls: ['./pincode-outer.component.scss'],
})
export class PincodeOuterComponent implements OnInit {

  pincode: any;
  constructor(public app: AppService, public utility: UtilityService) { }

  ngOnInit() {}

  save() {
    this.utility.loader('Please Wait...');
    this.app.api.isVaildPincode({pincode: this.pincode}).subscribe(res => {
      this.utility.loaderDismiss();
      if(res.status) {
        if(res.status == 'success') {
          this.app.state.set('pincode', this.pincode);
        } else {
          this.utility.toast(res.message);
        }
      } else {
        this.utility.toast("Something went wrong");
      }
    },
    error => {
      this.utility.loaderDismiss();
      this.utility.toast("Something went wrong");
    }
    )
  }

  onlynumber(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
