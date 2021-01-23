import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../../jApp/app/app.service';
import { RestApiService } from '../../../../jApp/server/rest-api.service';
import { UtilityService } from '../../../../jIonic/utility.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {

  requestForm: FormGroup;
  requests: any;
  showForm: boolean = false;

  constructor(public app: AppService, public utility: UtilityService, public navCtrl: NavController, private restApi: RestApiService, public zone: NgZone) { }

  ngOnInit() {
    this.app.api.getRequests({vendor: this.app.state.user.id}).subscribe(res => {
      this.requests = res.data;
    });
    this.requestFormInit();
  }

  requestFormInit(): void {
    this.requestForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    })
  }

  save() {
    let data = this.requestForm.value;

    if(data.title == '') {
      this.utility.toast('Please fill title for the request');
      return;
    }

    
    if(data.description == '') {
      this.utility.toast('Please fill description');
      return;
    }

    data.id = this.app.state.user.id;

    this.utility.loader('Please wait ...');
    this.app.api.addRequest(data).subscribe(res => {
      this.utility.loaderDismiss();
      if (res && res.status == 'success') {
        this.utility.toast('Request Submitted');
        this.navCtrl.navigateBack('/home');
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

}
