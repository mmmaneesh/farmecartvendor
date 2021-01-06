import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../jApp/app/app.service';
import { UtilityService } from '../../../jIonic/utility.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss'],
})
export class BillingAddressComponent implements OnInit {
  billingform: FormGroup;
  isSubmit: boolean = false;

  @Input() isFromCheckout;
  constructor(public app: AppService, public utility: UtilityService, public navCrt: NavController,  public modalCtrl: ModalController) { }

  ngOnInit() {
    this.billingFormInit();
    //this.app.getPincodes();
  }

  gotoCheckout() {
    this.modalCtrl.dismiss({saved: false});
  }

  billingFormInit(): void {
    if(this.app.state.detail != null && typeof(this.app.state.detail.billing_address) != 'undefined') {
      this.billingform = new FormGroup({
        firstname: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.firstname : '', Validators.required),
       // lastname: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.lastname : '', Validators.required),
        email: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.email : '', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        number: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.number : '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        country: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.country : '', Validators.required),
        address: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.address : '', Validators.required),
        city: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.city : '', Validators.required),
        zipcode: new FormControl(this.app.state.detail ? this.app.state.detail.billing_address.zipcode : '', Validators.required)
      })
    } else {
      this.billingform = new FormGroup({
        firstname: new FormControl('', Validators.required),
       // lastname: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        country: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zipcode: new FormControl('', Validators.required)
      });
    }
  }


  save() {
    this.billingform.markAsTouched();
    this.isSubmit = true;
    if (this.billingform.valid) {
      let data = this.billingform.value;
      data.id = this.app.state.user.id;
      this.utility.loader('Please wait ...');


      this.app.api.updateProfile({name: data.firstname, primary_email: data.email, id : this.app.state.user.id}).subscribe(res => {
        if(res && res.status == 'success') {
         this.app.state.user.display_name = data.firstname;
         this.app.state.user.primary_email = data.email;
         this.app.state.set('user', this.app.state.user);
        } 
      });
      
      this.app.api.updateBillingAddress(data).subscribe(res => {
        this.utility.loaderDismiss();
        if (res && res.status == 'success') {
          this.utility.toast('Updated');
          if(this.app.state.detail == null) this.app.state.detail = {};
          this.app.state.detail.billing_address = data;
          this.app.state.set('detail', this.app.state.detail);
          if(typeof this.isFromCheckout == 'undefined') {
            this.navCrt.pop();
          } else {
            this.modalCtrl.dismiss({saved: true});
          }
          
        } else {
          if (res.validator) {
            let message = '';
            for (let x in res.validator) {
              message = message + res.validator[x][0] + '\n';
            }
            this.utility.toast(message);
          } else if (res.message) {
            this.utility.toast(res.message);
          }
          else {
            this.utility.toast('Something went wrong.');
          }
        }
      }, error => {
        this.utility.loaderDismiss();
        this.utility.toast('Something went wrong.');
      });
    }
    if (this.billingform.invalid) {
      this.utility.toast("Please fill form properly");
      return;
    }
  }
}
