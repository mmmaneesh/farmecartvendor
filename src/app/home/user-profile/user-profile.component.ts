import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../jApp/app/app.service';
import { UtilityService } from '../../../jIonic/utility.service';
import { NavController } from '@ionic/angular';
import { RestApiService } from '../../../jApp/server/rest-api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileform: FormGroup;

  constructor(public app: AppService, public utility: UtilityService, public navCtrl: NavController, private restApi: RestApiService, public zone: NgZone) { }

  ngOnInit() {
    this.personalFormInti();
  }

  personalFormInti(): void {
    this.profileform = new FormGroup({
      name: new FormControl(this.app.state.user.display_name, Validators.required),
      number: new FormControl(this.app.state.user.mobile, Validators.required),
      primary_email: new FormControl(this.app.state.user.primary_email, Validators.required)
    })
  }

  save() {
    let data = this.profileform.value;
    data.id = this.app.state.user.id;

    if(data.name == '') {
      this.utility.toast('Please fill full name');
      return;
    }

    
    if(data.primary_email == '') {
      this.utility.toast('Please fill email');
      return;
    }

    this.utility.loader('Please wait ...');
    this.app.api.updateProfile(data).subscribe(res => {
      this.utility.loaderDismiss();
      if(res && res.status == 'success') {
       this.utility.toast('Updated');
       this.app.state.user.display_name = data.name;
       this.app.state.user.primary_email = data.primary_email;
       this.app.state.set('user', this.app.state.user);
       this.navCtrl.pop();
      } else {
        if(res.validator) {
          let message = '';
          for(let x in res.validator) {
            message = message + res.validator[x][0] + '\n';
          }
          this.utility.toast(message);
        } else if(res.message){
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

  userPic(name) {
    return this.restApi.domain + '/public/uploads/' + name; 
  }

  click_Image() {
    let selection: any = this.utility.uploadPicCamGal();
    selection.then((res) => {
      if (res == 'Gallery') {
        this.utility.uploadGalPic('/upload-profile-pic', {user_id: this.app.state.user.id}).then((res: any) => {
          res = JSON.parse(res);
          if (res && res.status == 'success') {
            this.zone.run(() => {
              this.utility.toast("Profile Picture Changed");
              this.app.state.user.user_photo_url = '';
              setTimeout(()=> {
                this.app.state.user.user_photo_url = res.name;
                this.app.state.set('user',this.app.state.user);
              });
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
      if (res == 'Camera') {
        this.utility.uploadCameraPic('/upload-profile-pic',  {user_id: this.app.state.user.id}).then((res: any) => {
          res = JSON.parse(res);
          if (res && res.status == 'success') {
            this.zone.run(() => {
              this.utility.toast("Profile Picture Changed");
              this.app.state.user.user_photo_url = '';
              setTimeout(()=> {
                this.app.state.user.user_photo_url = res.name;
                this.app.state.set('user',this.app.state.user);
              });
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
    }, err => {
      console.log(err);
    });
  }
}
