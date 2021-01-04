import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../../jIonic/utility.service';
import { AppService } from '../../../jApp/app/app.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})
export class ContactusComponent implements OnInit {

  form: any = {
    name: '',
    email: '',
    mobile: '',
    content: ''
  }

  constructor(public utility: UtilityService, public app: AppService, public navCrt: NavController,) { }

  ngOnInit() {}

  submit() {
    let {name, email, mobile, content} = this.form;

    if(name.length < 3) {
      this.utility.toast("Please fill proper name");
      return;
    }

    if(email.length < 3) {
      this.utility.toast("Please fill proper email");
      return;
    }

    if(mobile.length < 10) {
      this.utility.toast("Please fill proper mobile number");
      return;
    }

    if(content.length < 3) {
      this.utility.toast("Please fill proper message");
      return;
    }

    this.utility.loader('Please wait ...');
    this.app.api.contactus(this.form).subscribe(res => {
      this.utility.loaderDismiss();
      if (res && res.status == 'success') {
        this.utility.toast('Message sent');
        this.navCrt.pop();
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

}
